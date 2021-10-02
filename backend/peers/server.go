package peers

import (
	"context"
	"log"
	"net"
	"time"
)

const buffsize = 8192

type ServerHandlers interface {
	Context() context.Context
	OnLeave(from *net.UDPAddr)
	OnMessage(from *net.UDPAddr, contents string)
}

func StartServer(h ServerHandlers) error {
	addr, err := net.ResolveUDPAddr("udp", ":0")
	if err != nil {
		return err
	}

	conn, err := net.ListenUDP("udp", addr)
	if err != nil {
		return err
	}

	go listen(conn, h)

	return nil
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
			if err != nil {
				log.Fatal(err)
			}

			packetHandler(addr, buff[:r], h)
		}
	}
}
