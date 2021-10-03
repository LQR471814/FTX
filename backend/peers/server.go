package peers

import (
	"context"
	"ftx/backend/netutils"
	"log"
	"net"
	"os"
	"time"
)

const buffsize = 8192

type ServerHandlers interface {
	Context() context.Context
	OnLeave(from net.IP)
	OnMessage(from net.IP, contents string)
}

func StartServer(h ServerHandlers, port int) {
	addr, err := net.ResolveUDPAddr("udp", netutils.ConstructAddrStr(nil, port))
	if err != nil {
		log.Fatal(err)
	}

	conn, err := net.ListenUDP("udp", addr)
	if err != nil {
		log.Fatal(err)
	}

	go listen(conn, h)
}

func listen(c *net.UDPConn, h ServerHandlers) {
listen:
	for {
		select {
		case <-h.Context().Done():
			break listen
		default:
			c.SetReadDeadline(time.Now().Add(time.Second))

			buff := make([]byte, buffsize)
			r, addr, err := c.ReadFromUDP(buff)
			if err != nil && !os.IsTimeout(err) {
				log.Fatal(err)
			}

			packetHandler(addr, buff[:r], h)
		}
	}
}
