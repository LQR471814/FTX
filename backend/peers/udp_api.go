package peers

import (
	"log"
	"net"
)

const (
	LEAVING_PACKET byte = iota
	MESSAGE_PACKET
)

func constructLeavePacket() []byte {
	return []byte{LEAVING_PACKET}
}

func constructMessagePacket(message string) []byte {
	return append([]byte{
		MESSAGE_PACKET,
	}, []byte(message)...)
}

func packetHandler(addr *net.UDPAddr, buff []byte, h ServerHandlers) {
	if !(len(buff) > 0) {
		return
	}

	log.Println(buff)

	packetType := buff[0]
	payload := buff[1:]

	switch packetType {
	case LEAVING_PACKET:
		h.OnLeave(addr.IP)
	case MESSAGE_PACKET:
		msg := string(payload)
		h.OnMessage(addr.IP, msg)
	}
}
