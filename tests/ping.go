package main

import (
	"fmt"
	"log"
	"net"
	"time"

	"golang.org/x/net/ipv4"
)

var multicastGroup = net.IPv4(224, 0, 2, 20)

const PortNum int = 9999

func main() {
	for {
		ping("wlp3s0", []byte("Ping!"))
		time.Sleep(1 * time.Second)
	}
}

func ping(ifname string, bytes []byte) {
	intf, err := net.InterfaceByName(ifname)
	if err != nil {
		log.Fatal(err)
	}
	c, err := net.ListenPacket("udp4", fmt.Sprintf("0.0.0.0:%d", PortNum))
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	p := ipv4.NewPacketConn(c)
	if err := p.JoinGroup(intf, &net.UDPAddr{IP: multicastGroup}); err != nil {
		log.Fatal(err)
	}
	dst := &net.UDPAddr{IP: multicastGroup, Port: PortNum}
	if err := p.SetMulticastInterface(intf); err != nil {
		log.Fatal(err)
		p.SetMulticastTTL(2)
		if _, err := p.WriteTo(bytes, nil, dst); err != nil {
			log.Fatal(err)
		}
	}
}
