package ftx

import (
	"log"
	"net"
	"strconv"
)

func getInterfaces() [][3]string {
	interfaces, err := net.Interfaces()
	if err != nil {
		log.Fatal(err)
	}
	response := make([][3]string, len(interfaces))
	for i, itf := range interfaces {
		a, _ := itf.Addrs()
		addr4 := getIpv4(a)
		addrResult := ""
		if addr4 == nil {
			addrResult = ""
		} else {
			addrResult = addr4.String()
		}
		response[i] = [3]string{strconv.Itoa(itf.Index), itf.Name, addrResult}
	}
	return response
}
