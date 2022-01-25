package main

import (
	"context"
	"fmt"
	"ftx/backend/api"
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

type TransferHandler struct {
	state *state.State
}

func (h TransferHandler) OnTransferRequest(t *api.TransferRequest) chan bool {
	for _, c := range h.state.TransferRequestChannels {
		c.Send(t)
	}

	ch := make(chan bool, 1)
	h.state.PendingTransfers[t.Id] = ch
	return ch
}

func (h TransferHandler) OnTransferUpdate(t *api.TransferState) {
	for _, c := range h.state.TransferUpdateChannels {
		c.Send(t)
	}
}

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

	log.Println(from.String())
	log.Println("Received message", fmt.Sprintf("\"%v\"", message), "from", p.Name)

	h.state.UpdateMessageChannels(&api.Message{
		Author:   p.IP.String(),
		Contents: message,
	})
}

//lint:ignore U1000 main is used (duh)
func main() {
	log.SetFlags(log.Lshortfile | log.Ltime)

	s, err := state.CreateState()
	if err != nil {
		log.Fatal(err)
	}
	defer onQuit(s)

	log.Println("Registering mDNS and listening for peers")

	peers.Register(s)
	peers.StartServer(PeersHandler{s}, s.ListenerPort(state.INTERACT_LISTENER_ID))
	peers.Discover(
		s, func(p state.Peer) {
			local, err := netutils.CheckLocal(p.IP)
			if err != nil {
				log.Fatal(err)
			}

			log.Println(p)

			if local &&
				p.FilePort == s.ListenerPort(state.FILE_LISTENER_ID) &&
				p.InteractPort == s.ListenerPort(state.INTERACT_LISTENER_ID) {
				return
			}

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

	go transfer.Listen(
		s.Listeners[state.FILE_LISTENER_ID],
		TransferHandler{state: s},
	)

	log.Println("Serving filerecv on", s.ListenerPort(state.FILE_LISTENER_ID))
	log.Println("Serving interact on", s.ListenerPort(state.INTERACT_LISTENER_ID))
	log.Println("Serving gui on", s.ListenerPort(state.GUI_LISTENER_ID))

	go ServeGUI(s, s.Listeners[state.GUI_LISTENER_ID])
	go openGUI(s.ListenerPort(state.GUI_LISTENER_ID))

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
