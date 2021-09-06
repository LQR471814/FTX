package state

import (
	"ftx/common"
	"net"
)

type State struct {
	Settings  *Settings
	Peers     map[string]common.Peer
	Listeners map[string]net.Listener
	Group     *net.UDPAddr
}

var LISTENER_IDENTIFIERS = []string{
	"gui",
	"grpc",
	"file",
}

func CreateState(group string) (*State, error) {
	var err error

	state := State{}
	state.Group, err = net.ResolveUDPAddr("udp", group)
	if err != nil {
		return nil, err
	}

	state.Settings.Load()
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
