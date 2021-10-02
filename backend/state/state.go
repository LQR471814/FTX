package state

import (
	"context"
	"ftx/backend/api"
	"net"
	"os"
)

//? There is a separate type def here instead of directly using "api.User" because api.User contains some extra things that aren't pure data
type Peer struct {
	Name string
	Addr *net.UDPAddr
}

type State struct {
	Settings *Settings

	PeerUpdateChannels    *[]api.Backend_ListenUsersServer
	MessageUpdateChannels *[]api.Backend_ListenMessagesServer
	Peers                 map[string]Peer
	Listeners             map[string]net.Listener

	Name string

	Context  context.Context
	ExitFunc context.CancelFunc
}

var LISTENER_IDENTIFIERS = []string{
	"mdns",
	"gui",
	"file",
}

func CreateState() (*State, error) {
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

	state.PeerUpdateChannels = &[]api.Backend_ListenUsersServer{}
	state.MessageUpdateChannels = &[]api.Backend_ListenMessagesServer{}

	state.Context, state.ExitFunc = context.WithCancel(context.Background())
	state.Peers = make(map[string]Peer)
	state.Listeners = make(map[string]net.Listener)

	for _, id := range LISTENER_IDENTIFIERS {
		state.Listeners[id], err = net.Listen("tcp", ":0")
		if err != nil {
			return nil, err
		}
	}

	return &state, nil
}

func (s *State) ListenerPort(id string) int {
	return (*s).Listeners[id].Addr().(*net.TCPAddr).Port
}

func (s *State) UpdatePeerChannels() {
	peers := []*api.User{}
	for _, p := range s.Peers {
		peers = append(peers, &api.User{
			Name: p.Name,
			IP:   p.Addr.String(),
		})
	}

	for _, peerUpdateChannel := range *s.PeerUpdateChannels {
		peerUpdateChannel.Send(&api.UsersResponse{
			Users: peers,
		})
	}
}
