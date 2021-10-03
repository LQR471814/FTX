package main

import (
	"context"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"

	"ftx/backend/api"
	"ftx/backend/netutils"
	"ftx/backend/peers"
	"ftx/backend/state"
)

type BackendServer struct {
	api.UnimplementedBackendServer
	state *state.State
}

func (*BackendServer) GetSelf(ctx context.Context, req *api.Empty) (*api.SelfResponse, error) {
	host, err := os.Hostname()
	if err != nil {
		log.Println("ERROR:", err)
	}

	return &api.SelfResponse{
		Hostname: host,
	}, err
}

func (s *BackendServer) GetSetup(ctx context.Context, req *api.Empty) (*api.GetSetupResponse, error) {
	interfaces, err := netutils.GetInterfaces()
	if err != nil {
		log.Println("ERROR:", err)
		return nil, err
	}

	return &api.GetSetupResponse{
		Required:   s.state.Settings.Interface < 0,
		Interfaces: interfaces,
	}, nil
}

func (s *BackendServer) SetSetup(ctx context.Context, req *api.SetSetupRequest) (*api.Empty, error) {
	execpath, err := os.Executable()
	if err != nil {
		log.Println("ERROR:", err)
		return nil, err
	}

	utilitypath := filepath.Join(
		filepath.Dir(execpath),
		"mcast-utility.exe",
	)

	err = exec.Command(
		utilitypath,
		"-Interface", strconv.Itoa(int(req.Interface.Index)),
		"-Path", execpath,
	).Run()

	s.state.Settings.Lock()
	s.state.Settings.Interface = int(req.Interface.Index)
	s.state.Settings.Write()
	s.state.Settings.Unlock()

	return nil, err
}

func (s *BackendServer) ListenMessages(_ *api.Empty, stream api.Backend_ListenMessagesServer) error {
	s.state.MessageUpdateChannels = append(s.state.MessageUpdateChannels, stream)
	<-s.state.Context.Done()
	return nil
}

func (s *BackendServer) ListenUsers(_ *api.Empty, stream api.Backend_ListenUsersServer) error {
	s.state.PeerUpdateChannels = append(s.state.PeerUpdateChannels, stream)
	s.state.UpdatePeerChannels()

	<-s.state.Context.Done()
	return nil
}

func (s *BackendServer) GetUsers(ctx context.Context, req *api.Empty) (*api.UsersResponse, error) {
	result := []*api.User{}
	for _, peer := range s.state.Peers {
		result = append(result, &api.User{
			IP:   peer.IP.String(),
			Name: peer.Name,
		})
	}

	return &api.UsersResponse{
		Users: result,
	}, nil
}

func (s *BackendServer) SendMessage(ctx context.Context, req *api.MessageRequest) (*api.Empty, error) {
	err := peers.Message(
		s.state.Peers[req.To.IP],
		req.Message.Contents,
	)
	if err != nil {
		return nil, err
	}

	return &api.Empty{}, nil
}

func (s *BackendServer) Quit(ctx context.Context, _ *api.Empty) (*api.Empty, error) {
	s.state.ExitFunc()
	return &api.Empty{}, nil
}
