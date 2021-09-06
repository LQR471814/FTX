package peers

import (
	"net"

	"github.com/LQR471814/multicast"
)

const (
	USER_REGISTRATION_FLAG = 0
	KEEP_ALIVE_FLAG        = 1
	USER_QUIT_FLAG         = 2
	USER_MESSAGE_FLAG      = 3
)

func Register(group *net.UDPAddr, name string) {
	message := append([]byte{USER_REGISTRATION_FLAG}, []byte(name)...)
	multicast.Ping(group, message)
}

func KeepAlive(group *net.UDPAddr) {
	message := []byte{KEEP_ALIVE_FLAG}
	multicast.Ping(group, message)
}

func Quit(group *net.UDPAddr) {
	message := []byte{USER_QUIT_FLAG}
	multicast.Ping(group, message)
}

func Message(group *net.UDPAddr, ip string, msg string) {
	message := append([]byte{USER_MESSAGE_FLAG}, []byte(ip)...)
	message = append(message, 0)
	message = append(message, []byte(msg)...)

	multicast.Ping(group, message)
}
