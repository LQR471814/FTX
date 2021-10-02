package peers

import "net"

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
	packetType := buff[0]
	payload := buff[1:]

	switch packetType {
	case LEAVING_PACKET:
		h.OnLeave(addr)
	case MESSAGE_PACKET:
		msg := string(payload)
		h.OnMessage(addr, msg)
	}
}
