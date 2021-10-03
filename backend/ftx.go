package main

import (
	"context"
	"fmt"
	"ftx/backend/netutils"
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

func (h PeersHandler) OnLeave(from net.IP) {
	delete(h.state.Peers, from.String())
	h.state.UpdatePeerChannels()
}

func (h PeersHandler) OnMessage(from net.IP, message string) {
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

	peers.Register(s)
	defer peers.Quit(s)

	peers.StartServer(PeersHandler{s}, s.ListenerPort(state.INTERACT_LISTENER_ID))
	peers.Discover(
		s, func(p state.Peer) {
			local, err := netutils.CheckLocal(p.IP)
			if err != nil {
				log.Fatal(err)
			}

			if !local {
				s.Peers[p.IP.String()] = p
				s.UpdatePeerChannels()
				log.Println(p)
			}
		},
	)

	go ServeFile(s.Listeners[state.FILE_LISTENER_ID])
	go ServeGUI(s, s.Listeners[state.GUI_LISTENER_ID])
	go openGUI(s.ListenerPort(state.GUI_LISTENER_ID))

	log.Println("Serving filerecv on", s.ListenerPort(state.FILE_LISTENER_ID))
	log.Println("Serving interact on", s.ListenerPort(state.INTERACT_LISTENER_ID))
	log.Println("Serving gui on", s.ListenerPort(state.GUI_LISTENER_ID))

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
