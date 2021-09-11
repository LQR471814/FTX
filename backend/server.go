package main

import (
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"

	"ftx/backend/api"
	"ftx/backend/peers"
	"ftx/backend/state"

	"github.com/LQR471814/multicast"
)

type BackendServer struct {
	api.UnimplementedBackendServer
	state *state.State
}

func (*BackendServer) GetSelf(ctx context.Context, req *api.Empty) (*api.SelfResponse, error) {
	host, err := os.Hostname()

	return &api.SelfResponse{
		Hostname: host,
	}, err
}

func (s *BackendServer) GetSetup(ctx context.Context, req *api.Empty) (*api.GetSetupResponse, error) {
	multicastWorks, err := multicast.Check()
	if err != nil {
		return nil, err
	}

	interfaces, err := GetInterfaces()
	if err != nil {
		return nil, err
	}

	return &api.GetSetupResponse{
		Required: !multicastWorks ||
			(*s.state).Settings.Interface < 0,
		Interfaces: interfaces,
	}, nil
}

func (*BackendServer) SetSetup(ctx context.Context, req *api.SetSetupRequest) (*api.Empty, error) {
	execpath, err := os.Executable()
	if err != nil {
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

	if err != nil {
		return nil, err
	}

	return nil, nil
}

func (s *BackendServer) ListenMessages(_ *api.Empty, stream api.Backend_ListenMessagesServer) error {
	*s.state.MessageUpdateChannels = append(*s.state.MessageUpdateChannels, stream)
	return nil
}

func (s *BackendServer) ListenUsers(_ *api.Empty, stream api.Backend_ListenUsersServer) error {
	*s.state.PeerUpdateChannels = append(*s.state.PeerUpdateChannels, stream)
	return nil
}

func (s *BackendServer) GetUsers(ctx context.Context, req *api.Empty) (*api.UsersResponse, error) {
	result := []*api.User{}
	for _, peer := range s.state.Peers {
		result = append(result, &api.User{
			IP:   peer.Addr.String(),
			Name: peer.Name,
		})
	}

	return &api.UsersResponse{
		Users: result,
	}, nil
}

func (s *BackendServer) SendMessage(ctx context.Context, req *api.MessageRequest) (*api.Empty, error) {
	peers.Message(s.state.Group, req.Message.Author.IP, req.Message.Contents)
	return nil, nil
}
