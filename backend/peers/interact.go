package peers

import (
	"ftx/backend/state"
	"log"
	"net"
	"strconv"

	"github.com/grandcat/zeroconf"
)

const (
	MDNS_SERVICE_STR  = "ftx.active._udp"
	DESCRIPTOR_LENGTH = 2 //TODO: Remember to update this every time the length of the port index enum is changed
)

const (
	FILE_PORT_INDEX int = iota
	INTERACT_PORT_INDEX
)

func Message(to state.Peer, message string) error {
	msg := constructMessagePacket(message)
	conn, err := net.Dial("udp", to.Addr.String()+":"+strconv.Itoa(to.InteractPort))
	if err != nil {
		return err
	}

	conn.Write(msg)
	return nil
}

func Quit(s *state.State) error {
	msg := constructLeavePacket()
	for _, p := range s.Peers {
		conn, err := net.Dial("udp", p.Addr.String())
		if err != nil {
			return err
		}

		conn.Write(msg)
	}
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
			addr, err := net.ResolveUDPAddr(
				"udp",
				entry.AddrIPv4[0].String()+":"+strconv.Itoa(entry.Port),
			)
			if err != nil {
				log.Fatal(err)
			}

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
				Addr:         addr,
				FilePort:     filePort,
				InteractPort: interactPort,
			})
		}
	}()

	resolver.Browse(s.Context, MDNS_SERVICE_STR, "", entries)
}
