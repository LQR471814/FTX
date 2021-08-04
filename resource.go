package main

import (
	"fmt"
	"log"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
)

//ResourceRequest defines the information given by a front end resource request
type ResourceRequest struct {
	Name       string
	Parameters ResourceParameters
}

//ResourceResponse defines the bundled information returned to a front end resource request
type ResourceResponse struct {
	MsgType  string
	Response ResponseContent
}

//ResponseContent defines the results returned to a front end resource request
type ResponseContent struct {
	GetInterfaces [][3]string
	GetOS         string
	GetHostname   string
	RequireSetup  bool
}

//ResourceParameters defines the parameters passed to a resource request
type ResourceParameters struct {
	InterfaceID        int
	MessageDestination string
	Message            string
}

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

func getIpv4(Addrs []net.Addr) net.Addr {
	for _, addr := range Addrs {
		if strings.Count(addr.String(), ":") < 2 {
			return addr
		}
	}
	return nil
}

func setInterfaces(parameters ResourceParameters) {
	settings.mux.Lock()
	settings.InterfaceID = parameters.InterfaceID
	settings.Default = false
	settings.mux.Unlock()

	if runtime.GOOS == "windows" {
		dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println(dir+"\\"+"SetMulticast.exe", "--interface "+strconv.Itoa(parameters.InterfaceID), "--path "+dir+"\\"+"ftx.exe")
		out, err := exec.Command(dir+"\\"+"SetMulticast.exe", "--interface "+strconv.Itoa(parameters.InterfaceID), "--path "+dir+"\\"+"ftx.exe").Output()
		if err != nil {
			log.Fatal(err)
		}

		fmt.Println(out)
	}
}

func getHostname() string {
	Name, err := os.Hostname()
	if err != nil {
		log.Fatal(err)
	}
	return Name
}

func requireSetup() bool {
	checksTotal := 0
	checksFulfilled := 0

	checksTotal++
	if !settings.Default {
		checksFulfilled++
	}

	if runtime.GOOS == "windows" {
		out, err := exec.Command("powershell.exe", "Get-NetRoute").Output()
		if err != nil {
			log.Fatal(err)
		}

		lines := []string{}
		for _, line := range strings.Split(string(out), "\r\n") {
			if strings.Contains(line, "224.0.0.0") {
				lines = append(lines, line)
			}
		}

		checksTotal++
		for i := 0; i < len(lines); i++ {
			if strings.Fields(lines[i])[3] != "256" {
				checksFulfilled++
				break
			}
		}

		checksTotal++
		err = exec.Command("powershell.exe", "Get-NetFirewallRule", "-DisplayName \"FTX\"").Run()
		if err == nil {
			checksFulfilled++
		}
	}

	return (checksTotal != checksFulfilled)
}

func isLocal(s string) bool {
	if strings.Contains(s, "localhost") || strings.Contains(s, "[::1]") {
		return true
	}
	return false
}
