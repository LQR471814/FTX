package peers

import (
	"fmt"
	"ftx/backend/netutils"
	"ftx/backend/state"
	"log"
	"net"
	"strconv"

	"github.com/LQR471814/zeroconf"
)

const (
	MDNS_SERVICE_STR  = "ftx.active._udp"
	DESCRIPTOR_LENGTH = 2 //TODO: Remember to update this every time the length of the port index enum is changed
)

const (
	FILE_PORT_INDEX int = iota
	INTERACT_PORT_INDEX
)

func SendToPeer(to state.Peer, buf []byte) error {
	addr, err := net.ResolveUDPAddr("udp", netutils.ConstructAddrStr(to.IP, to.InteractPort))
	if err != nil {
		return err
	}

	conn, err := net.DialUDP("udp", nil, addr)
	if err != nil {
		return err
	}

	_, err = conn.Write(buf)
	if err != nil {
		return err
	}

	return nil
}

func Message(to state.Peer, message string) error {
	msg := constructMessagePacket(message)
	err := SendToPeer(to, msg)
	if err != nil {
		return err
	}

	log.Println("Send", fmt.Sprintf("\"%v\"", message), "to", netutils.ConstructAddrStr(to.IP, to.InteractPort))
	return nil
}

func Quit(s *state.State) error {
	msg := constructLeavePacket()
	for _, p := range s.Peers {
		err := SendToPeer(p, msg)
		if err != nil {
			return err
		}
	}

	log.Println("Sending leave notification")

	return nil
}

func Register(s *state.State) {
	descriptor := make([]string, DESCRIPTOR_LENGTH)
	descriptor[FILE_PORT_INDEX] = strconv.Itoa(s.ListenerPort(state.FILE_LISTENER_ID))
	descriptor[INTERACT_PORT_INDEX] = strconv.Itoa(s.ListenerPort(state.INTERACT_LISTENER_ID))

	_, err := zeroconf.Register(
		s.Name, MDNS_SERVICE_STR, "local.",
		s.ListenerPort(state.MDNS_LISTENER_ID),
		descriptor, nil,
	)

	if err != nil {
		log.Fatal(err)
	}
}

func Discover(s *state.State, callback func(state.Peer)) {
	resolver, err := zeroconf.NewResolver(nil)
	if err != nil {
		log.Fatal(err)
	}

	entries := make(chan *zeroconf.ServiceEntry)

	go func() {
		for entry := range entries {
			filePort, err := strconv.Atoi(entry.Text[FILE_PORT_INDEX])
			if err != nil {
				log.Fatal(err)
			}

			interactPort, err := strconv.Atoi(entry.Text[INTERACT_PORT_INDEX])
			if err != nil {
				log.Fatal(err)
			}

			callback(state.Peer{
				Name:         entry.Instance,
				IP:           entry.TrueAddr.(*net.UDPAddr).IP,
				FilePort:     filePort,
				InteractPort: interactPort,
			})
		}
	}()

	resolver.Browse(s.Context, MDNS_SERVICE_STR, "", entries)
}
