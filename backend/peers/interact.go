package peers

import (
	"ftx/backend/state"
	"log"
	"net"
	"strconv"

	"github.com/grandcat/zeroconf"
)

const (
	MDNS_SERVICE_STR = "ftx.active._udp"

	MDNS_DESCRIPTOR = "FTX, the universal file transfer service"
)

func Message(to state.Peer, message string) error {
	msg := constructMessagePacket(message)
	conn, err := net.Dial("udp", to.Addr.String())
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

func Register(name string, port int) {
	_, err := zeroconf.Register(
		name, MDNS_SERVICE_STR, "local.", port,
		[]string{MDNS_DESCRIPTOR}, nil,
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

			callback(state.Peer{
				Name: entry.Instance,
				Addr: addr,
			})
		}
	}()

	resolver.Browse(s.Context, MDNS_SERVICE_STR, "", entries)
}
