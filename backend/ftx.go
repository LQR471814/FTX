package main

import (
	"context"
	"fmt"
	"ftx/backend/peers"
	"ftx/backend/state"
	"log"
	"net"

	"github.com/LQR471814/marionette"
)

type PeersHandler struct {
	state *state.State
}

func (h PeersHandler) Context() context.Context {
	return h.state.Context
}

func (h PeersHandler) OnLeave(from *net.UDPAddr) {
	delete(h.state.Peers, from.String())
	h.state.UpdatePeerChannels()
}

func (h PeersHandler) OnMessage(from *net.UDPAddr, message string) {
	p := h.state.Peers[from.String()]
	log.Println("Received message", message, "from", p.Name)
}

//lint:ignore U1000 main is used (duh)
func main() {
	log.SetFlags(log.Lshortfile | log.Ltime)

	s, err := state.CreateState()
	if err != nil {
		log.Fatal(err)
	}

	guiListener := s.Listeners["gui"]
	fileListener := s.Listeners["file"]

	peers.Register(s.Name, s.ListenerPort("mdns"))
	defer peers.Quit(s)

	peers.StartServer(PeersHandler{s})

	peers.Discover(
		s, func(p state.Peer) {
			log.Println(p)
			s.Peers[p.Addr.String()] = p
			s.UpdatePeerChannels()
		},
	)

	go ServeFile(fileListener)
	go ServeGUI(s, guiListener)
	go openGUI(s.ListenerPort("gui"))

	log.Println("Serving filerecv on", s.ListenerPort("file"))
	log.Println("Serving gui on", s.ListenerPort("gui"))

	<-s.Context.Done()
}

func openGUI(port int) {
	browser, err := marionette.DefaultBrowser()
	if err != nil {
		log.Fatal(err)
	}

	openURL := fmt.Sprintf("http://localhost:%v", port)

	switch browser {
	case marionette.CHROME, marionette.EDGE:
		marionette.OpenBrowser("--app="+openURL, "--guest")
	case marionette.FIREFOX:
		marionette.OpenBrowser("-P", "default", openURL)
	}
}
