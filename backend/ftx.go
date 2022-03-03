package main

import (
	"context"
	"fmt"
	"ftx/backend/api"
	"ftx/backend/flags"
	"ftx/backend/netutils"
	"ftx/backend/peers"
	"ftx/backend/state"
	"ftx/backend/transfer"
	"log"
	"net"
	"os"
	"os/signal"
	"syscall"

	"github.com/LQR471814/marionette"
)

type PeersHandler struct {
	state *state.State
}

func (h PeersHandler) Context() context.Context {
	return h.state.Context
}

func (h PeersHandler) OnLeave(from net.IP) {
	p := h.state.Peers[from.String()]
	log.Println(p.Name, "left")

	delete(h.state.Peers, from.String())
	h.state.UpdatePeerChannels()
}

func (h PeersHandler) OnMessage(from net.IP, message string) {
	p, ok := h.state.Peers[from.String()]
	if !ok {
		log.Println("Discarded message from unknown sender", from)
		return
	}

	log.Println("Received message", fmt.Sprintf("\"%v\"", message), "from", p.Name)

	h.state.UpdateMessageChannels(&api.Message{
		Author:   p.IP.String(),
		Contents: message,
	})
}

func main() {
	log.SetFlags(log.Lshortfile | log.Ltime)

	s, err := state.CreateState(flags.Parse())
	if err != nil {
		log.Fatal(err)
	}
	defer onQuit(s)

	log.Println("Registering mDNS and listening for peers")

	peers.Register(s)
	peers.StartServer(PeersHandler{s}, netutils.ListenerPort(s.InteractListener))
	peers.Discover(
		s, func(p state.Peer) {
			local, err := netutils.CheckLocal(p.IP)
			if err != nil {
				log.Fatal(err)
			}

			if local &&
				p.FilePort == netutils.ListenerPort(s.FileListener) &&
				p.InteractPort == netutils.ListenerPort(s.InteractListener) {
				return
			}

			log.Println("Add peer", p)

			s.Peers[p.IP.String()] = p
			s.UpdatePeerChannels()
			// log.Println(p)
		},
	)

	log.Println("Listening for sys interrupt")
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	go func() { //? Quit on signal interrupt
		<-c
		s.ExitFunc()
	}()

	log.Println("Listening for transfers")
	go transfer.Serve(s)

	log.Println("Serving filerecv on", netutils.ListenerPort(s.FileListener))
	log.Println("Serving interact on", netutils.ListenerPort(s.InteractListener))
	log.Println("Serving gui on", netutils.ListenerPort(s.GUIListener))

	go ServeGUI(s, s.GUIListener)
	go openGUI(netutils.ListenerPort(s.GUIListener))

	<-s.Context.Done()
}

func onQuit(s *state.State) {
	peers.Quit(s)
	os.Exit(0)
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
