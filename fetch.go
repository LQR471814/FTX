package ftx

import (
	"net"
	"os"
	"strings"
)

func getHostname() (string, error) {
	return os.Hostname()
}

func getIpv4(Addrs []net.Addr) net.Addr {
	for _, addr := range Addrs {
		if strings.Count(addr.String(), ":") < 2 {
			return addr
		}
	}
	return nil
}
