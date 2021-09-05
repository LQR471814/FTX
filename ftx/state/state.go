package state

import (
	"ftx/peers"
	"net"
)

type State struct {
	Settings  *Settings
	Peers     []*peers.Peer
	Listeners map[string]net.Listener
}

var LISTENER_IDENTIFIERS = []string{
	"gui",
	"grpc",
	"file",
}

var state = &State{}

func init() {
	var err error

	state.Settings.Load()
	state.Listeners = make(map[string]net.Listener)

	for _, id := range LISTENER_IDENTIFIERS {
		state.Listeners[id], err = net.Listen("tcp", ":0")
		if err != nil {
			panic(err)
		}
	}
}

func ListenerPort(id string) int {
	return state.Listeners[id].Addr().(*net.TCPAddr).Port
}

func Current() *State {
	return state
}
