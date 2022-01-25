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

type TargetUserUnknown struct{}

func (TargetUserUnknown) Error() string {
	return "The user you are attempting to interact with is not listed in backend state"
}

type TransferRequestUnknown struct{}

func (TransferRequestUnknown) Error() string {
	return "Transfer request doesn't exist in catalog"
}

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

func (s *BackendServer) ListenTransferRequests(_ *api.Empty, stream api.Backend_ListenTransferRequestsServer) error {
	s.state.TransferRequestChannels = append(s.state.TransferRequestChannels, stream)
	<-s.state.Context.Done()
	return nil
}

func (s *BackendServer) ListenTransferStates(_ *api.Empty, stream api.Backend_ListenTransferStatesServer) error {
	s.state.TransferUpdateChannels = append(s.state.TransferUpdateChannels, stream)
	<-s.state.Context.Done()
	return nil
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

func (s *BackendServer) TransferChoice(ctx context.Context, req *api.TransferChoiceRequest) (*api.Empty, error) {
	accept, ok := s.state.PendingTransfers[req.Id]
	if !ok {
		return nil, TransferRequestUnknown{}
	}

	accept <- req.GetAccept()
	return &api.Empty{}, nil
}

func (s *BackendServer) SendMessage(ctx context.Context, req *api.MessageRequest) (*api.Empty, error) {
	to, ok := s.state.Peers[req.To]
	if !ok {
		return nil, TargetUserUnknown{}
	}

	err := peers.Message(to, req.Message.Contents)
	if err != nil {
		return nil, err
	}

	return &api.Empty{}, nil
}

func (s *BackendServer) Quit(ctx context.Context, _ *api.Empty) (*api.Empty, error) {
	s.state.ExitFunc()
	return &api.Empty{}, nil
}
