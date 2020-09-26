// mping
package main

import (
	"fmt"
	"log"
	"net"
	"time"

	"golang.org/x/net/ipv4"
)

func main() {
	group := net.IPv4(224, 0, 0, 248)
	port := 9999
	intf, err := net.InterfaceByName("wlp3s0")
	if err != nil {
		log.Fatal(err)
	}
	c, err := net.ListenPacket("udp4", fmt.Sprintf("0.0.0.0:%d", port))
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	p := ipv4.NewPacketConn(c)
	if err := p.JoinGroup(intf, &net.UDPAddr{IP: group}); err != nil {
		log.Fatal(err)
	}
	p.SetTOS(0x0)
	p.SetTTL(16)
	data := []byte("ping")
	dst := &net.UDPAddr{IP: group, Port: port}

	if err := p.SetMulticastInterface(intf); err != nil {
		log.Fatal(err)
	}
	p.SetMulticastTTL(2)
	for {
		if _, err := p.WriteTo(data, nil, dst); err != nil {
			log.Fatal(err)
		}
		time.Sleep(time.Second)

	}
}
