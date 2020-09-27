// mping
package main

import (
	"flag"
	"log"
	"net"
	// "time"
	// "golang.org/x/net/ipv4"
)

func main() {
	grpaddrflag := flag.String("g", "224.0.0.248:5001", "group address")
	ifnameflag := flag.String("i", "Wi-Fi", "interfacen name")
	sending := flag.Bool("s", false, "sender")
	pktn := flag.Uint("n", 1, "number of pkt to send")
	flag.Parse()
	grpaddr, err := net.ResolveUDPAddr("udp", *grpaddrflag)
	if err != nil {
		log.Fatalf("invalid grp addr %v, %v", *grpaddrflag, err)
	}
	intf, err := net.InterfaceByName(*ifnameflag)
	if err != nil {
		log.Fatalf("cant find interface %v, %v", *ifnameflag, err)
	}
	conn, err := net.ListenMulticastUDP("udp4", intf, grpaddr)
	if err != nil {
		log.Fatalf("failed to listen on addr %v, %v", grpaddr, err)
	}
	log.Printf("local address is %v", conn.LocalAddr())
	if !*sending {
		const maxPktSize = 2000
		for {
			buf := make([]byte, maxPktSize)
			n, srcaddr, err := conn.ReadFromUDP(buf)
			if err != nil {
				log.Fatalf("failed to recv pkt, %v", err)

			}
			log.Printf("got pkt from %v", srcaddr)
			log.Printf("msg is %v", buf[:n])
		}
	} else {
		//sending pkt
		const pktcontent = "ping!"
		for i := 0; i < int(*pktn); i++ {
			_, err := conn.WriteToUDP([]byte(pktcontent), grpaddr)
			log.Printf("sent pkt %d", i)
			if err != nil {
				log.Fatalf("failed to send pkt, %v", err)
			}

		}
	}

}
