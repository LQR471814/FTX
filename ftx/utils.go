package ftx

import (
	"net"
)

func isLocal(s string) bool {
	ip := net.ParseIP(s)
	if ip == nil {
		return false
	}

	return ip.IsPrivate()
}
