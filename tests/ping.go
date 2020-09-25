package main

import (
	"log"
	"net"
	"time"
)

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
