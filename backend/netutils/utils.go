package netutils

import (
	"ftx/backend/api"
	"net"
)

func GetIPv4(addrs []net.Addr) net.IP {
	for _, a := range addrs {
		ip, _, err := net.ParseCIDR(a.String())
		if err != nil {
			return nil
		}

		as := ip.To4()
		if as != nil {
			return as
		}
	}

	return nil
}

func GetIPv6(addrs []net.Addr) net.IP {
	for _, a := range addrs {
		ip, _, err := net.ParseCIDR(a.String())
		if err != nil {
			return nil
		}

		as := ip.To16()
		if as != nil {
			return as
		}
	}

	return nil
}

func GetInterfaces() ([]*api.NetworkInterface, error) {
	result := []*api.NetworkInterface{}

	ifaces, err := net.Interfaces()
	if err != nil {
		return nil, err
	}

	for _, intf := range ifaces {
		addrs, err := intf.Addrs()
		if err != nil {
			return nil, err
		}

		preferredIP := GetIPv4(addrs)
		if preferredIP == nil {
			preferredIP = GetIPv6(addrs)
		}

		result = append(result, &api.NetworkInterface{
			Name:    intf.Name,
			Index:   int32(intf.Index),
			Address: preferredIP.String(),
		})
	}

	return result, nil
}

func StringToUDPAddr(s string) (*net.UDPAddr, error) {
	ip := net.ParseIP(s)
	addr, err := net.ResolveUDPAddr("udp", ip.String())
	if err != nil {
		return nil, err
	}

	return addr, nil
}

func AddrInInterface(index int, addr *net.UDPAddr) (bool, error) {
	intf, err := net.InterfaceByIndex(index)
	if err != nil {
		return false, err
	}

	addrs, err := intf.Addrs()
	if err != nil {
		return false, err
	}

	for _, a := range addrs {
		if a.String() == addr.String() {
			return true, nil
		}
	}

	return false, nil
}

func CheckLocal(target net.IP) (bool, error) {
	intfs, err := GetInterfaces()
	if err != nil {
		return false, nil
	}

	local := false
	for _, i := range intfs {
		ip := net.ParseIP(i.Address)
		if target.Equal(ip) {
			local = true
			break
		}
	}

	return local, nil
}
