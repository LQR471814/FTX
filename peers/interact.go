package peers

import (
	"log"
	"net"

	"github.com/LQR471814/multicast"
)

var group *net.UDPAddr

func init() {
	var err error

	group, err = net.ResolveUDPAddr("udp", MULTICAST_GROUP)
	if err != nil {
		log.Fatal(err)
	}
}

func Register(name string) {
	message := append([]byte{USER_REGISTRATION_FLAG}, []byte(name)...)
	multicast.Ping(group, message)
}

func KeepAlive() {
	message := []byte{KEEP_ALIVE_FLAG}
	multicast.Ping(group, message)
}

func Quit() {
	message := []byte{USER_QUIT_FLAG}
	multicast.Ping(group, message)
}

func Message(ip string, msg string) {
	message := append([]byte{USER_MESSAGE_FLAG}, []byte(ip)...)
	message = append(message, 0)
	message = append(message, []byte(msg)...)

	multicast.Ping(group, message)
}
