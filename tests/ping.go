package main

import (
	"log"
	"net"
	"time"
)

var multicastGroup = net.IPv4(224, 0, 2, 20)

func main() {
	for {
		ping([]byte("Ping!"))
		time.Sleep(1 * time.Second)
	}
}

func ping(bytes []byte) {
	addr, err := net.ResolveUDPAddr("udp4", multicastGroup.String()+":0")
	if err != nil {
		log.Fatal(err)
	}
	conn, err := net.DialUDP("udp4", nil, addr)
	conn.Write(bytes)
	conn.Close()
}
