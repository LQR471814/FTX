package peers

import (
	"context"
	"ftx/backend/state"
	"log"
	"net"

	"github.com/grandcat/zeroconf"
)

const (
	MDNS_ACTIVE_SERVICE_STR = "ftx.active._udp"
	MDNS_QUIT_SERVICE_STR   = "ftx.quit._udp"

	MDNS_DESCRIPTOR = "FTX, the universal file transfer service"
)

func Register(name string) error {
	_, err := zeroconf.Register(
		name, MDNS_ACTIVE_SERVICE_STR, "", 0,
		[]string{MDNS_DESCRIPTOR}, nil,
	)

	return err
}

func Quit() error {
	//? Hostname isn't specified here because other clients will use ip to identify the peer that has left
	_, err := zeroconf.Register(
		"", MDNS_QUIT_SERVICE_STR, "", 0,
		[]string{MDNS_DESCRIPTOR}, nil,
	)

	return err
}

func ListenService(ctx context.Context, service string, callback func(state.Peer)) {
	resolver, err := zeroconf.NewResolver(nil)
	if err != nil {
		log.Fatal(err)
	}

	entries := make(chan *zeroconf.ServiceEntry)

	go func() {
		go func() {
			for entry := range entries {
				addr, err := net.ResolveUDPAddr("udp", entry.AddrIPv4[0].String())
				if err != nil {
					log.Fatal(err)
				}

				callback(state.Peer{
					Name: entry.Instance,
					Addr: addr,
				})
			}
		}()

		ctx, _ := context.WithCancel(ctx)
		resolver.Browse(ctx, service, "", entries)

		<-ctx.Done()
	}()
}
