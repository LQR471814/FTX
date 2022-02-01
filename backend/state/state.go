package state

import (
	"context"
	"ftx/backend/api"
	"ftx/backend/flags"
	"log"
	"net"
	"os"
	"strconv"
)

//? There is a separate type def here instead of directly using "api.User" because api.User contains some extra things that aren't pure data
type Peer struct {
	Name         string
	IP           net.IP
	InteractPort int
	FilePort     int
}

func (p Peer) ToProto() *api.User {
	return &api.User{
		Name:     p.Name,
		Ip:       p.IP.String(),
		Fileport: int32(p.FilePort),
	}
}

type State struct {
	Settings *Settings

	PeerUpdateChannels      []api.Backend_ListenUsersServer
	MessageUpdateChannels   []api.Backend_ListenMessagesServer
	TransferUpdateChannels  []api.Backend_ListenIncomingStatesServer
	TransferRequestChannels []api.Backend_ListenIncomingRequestsServer

	Peers map[string]Peer

	MDNSListener     net.Listener
	GUIListener      net.Listener
	FileListener     net.Listener
	InteractListener net.Listener

	PendingTransfers map[string]chan bool

	Name string

	Context  context.Context
	ExitFunc context.CancelFunc
}

func CreateState(conf flags.BackendConfig) (*State, error) {
	var err error

	state := State{}
	if err != nil {
		return nil, err
	}

	state.Name, err = os.Hostname()
	if err != nil {
		return nil, err
	}

	state.Settings, err = LoadSettings()
	if err != nil {
		return nil, err
	}

	state.PeerUpdateChannels = []api.Backend_ListenUsersServer{}
	state.MessageUpdateChannels = []api.Backend_ListenMessagesServer{}
	state.TransferRequestChannels = []api.Backend_ListenIncomingRequestsServer{}
	state.TransferUpdateChannels = []api.Backend_ListenIncomingStatesServer{}

	state.Context, state.ExitFunc = context.WithCancel(context.Background())
	state.Peers = make(map[string]Peer)
	state.PendingTransfers = make(map[string]chan bool)

	filePort := "0"
	if conf.FILE_PORT > 0 {
		filePort = strconv.Itoa(conf.FILE_PORT)
	}

	interactPort := "0"
	if conf.INTERACT_PORT > 0 {
		interactPort = strconv.Itoa(conf.INTERACT_PORT)
	}

	state.MDNSListener, err = net.Listen("tcp", ":0")
	if err != nil {
		return nil, err
	}
	state.GUIListener, err = net.Listen("tcp", ":0")
	if err != nil {
		return nil, err
	}
	state.FileListener, err = net.Listen("tcp", ":"+filePort)
	if err != nil {
		return nil, err
	}
	state.InteractListener, err = net.Listen("tcp", ":"+interactPort)
	if err != nil {
		return nil, err
	}

	return &state, nil
}

func (s *State) UpdatePeerChannels() {
	peers := []*api.User{}
	for _, p := range s.Peers {
		peers = append(peers, p.ToProto())
	}

	log.Println("Peer Update Channels (gui)", s.PeerUpdateChannels)

	for _, stream := range s.PeerUpdateChannels {
		stream.Send(&api.UsersResponse{
			Users: peers,
		})
	}
}

func (s *State) UpdateMessageChannels(message *api.Message) {
	for _, stream := range s.MessageUpdateChannels {
		stream.Send(message)
	}
}
