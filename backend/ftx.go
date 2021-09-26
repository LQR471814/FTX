package main

import (
	"fmt"
	"ftx/backend/peers"
	"ftx/backend/state"
	"log"

	"github.com/LQR471814/marionette"
)

//lint:ignore U1000 main should be used
func main() {
	s, err := state.CreateState("224.0.0.248:5001")
	if err != nil {
		panic(err)
	}

	guiListener := s.Listeners["gui"]
	fileListener := s.Listeners["file"]

	peers.Register(s.Name)
	defer peers.Quit()

	go peers.ListenService(
		s.Context,
		peers.MDNS_ACTIVE_SERVICE_STR,
		func(p state.Peer) {
			s.Peers[p.Addr.String()] = p
			s.UpdatePeerChannels()
		},
	)

	go peers.ListenService(
		s.Context,
		peers.MDNS_QUIT_SERVICE_STR,
		func(p state.Peer) {
			delete(s.Peers, p.Addr.String())
			s.UpdatePeerChannels()
		},
	)

	go ServeFile(fileListener)
	go ServeGUI(s, guiListener)

	log.Println("Serving filerecv on", s.ListenerPort("file"))
	log.Println("Serving gui on", s.ListenerPort("gui"))

	marionette.OpenBrowser(
		fmt.Sprintf(
			"--app=http://localhost:%v",
			s.ListenerPort("gui"),
		), "--guest",
	)

	<-s.Context.Done()
}
