package main

import (
	"ftx/backend/peers"
	"ftx/backend/state"
)

//lint:ignore U1000 main should be used
func main() {
	s, err := state.CreateState("224.0.0.248:5001")
	if err != nil {
		panic(err)
	}

	guiListener := s.Listeners["gui"]
	fileListener := s.Listeners["file"]

	peers.Register(s.Group, s.Name)
	defer peers.Quit(s.Group)

	go PeerListen(s)
	go ServeFile(fileListener)
	ServeGUI(s, guiListener)
}
