package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"

	"github.com/gorilla/websocket"
)

const (
	multicastGroup = "224.0.2.20:"
	buffer         = 1024
)

//MulticastPacket contains information for a given multicast packet received
type MulticastPacket struct {
	content []byte
	src     *net.UDPAddr
}

//UserResponse defines the information returned when user update occurs
type UserResponse struct {
	MsgType string
	Name    string
	IP      string
}

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
	GetInterfaces   [][2]string
	SetInterfaces   []byte
	GetOS           string
	GetHostname     string
	RequireSetupWin bool
}

//ResourceParameters defines the parameters passed to a resource request
type ResourceParameters struct {
	InterfaceID int
}

var upgrader = websocket.Upgrader{}
var multicastChannel = make(chan MulticastPacket)

func main() {
	ping(append([]byte{0}, []byte(getHostname(ResourceParameters{}))...), multicastGroup)
	go serveMulticastUDP(multicastGroup)

	http.Handle("/", http.FileServer(http.Dir("./build")))
	http.HandleFunc("/resource", resource)
	http.HandleFunc("/updateUsers", updateUsers)
	http.ListenAndServe(":3000", nil)
}

func ping(bytes []byte, address string) {
	addr, err := net.ResolveUDPAddr("udp", address)
	if err != nil {
		log.Fatal(err)
	}
	conn, err := net.DialUDP("udp", nil, addr)
	conn.Write(bytes)
}

func serveMulticastUDP(address string) {
	addr, err := net.ResolveUDPAddr("udp", address)
	if err != nil {
		log.Fatal(err)
	}
	listener, err := net.ListenMulticastUDP("udp", nil, addr)
	listener.SetReadBuffer(buffer)
	for {
		bytes := make([]byte, buffer)
		_, src, err := listener.ReadFromUDP(bytes)
		if err != nil {
			log.Fatal("READFROMUDP FAILED:", err)
		}
		fmt.Println(MulticastPacket{bytes, src})
		multicastChannel <- MulticastPacket{bytes, src}
	}
}

func resource(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal("UPGRADE FAILED: ", err)
		return
	}
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Fatal("READ FAILED:", err)
			break
		}

		request := ResourceRequest{}
		err = json.Unmarshal(message, &request)
		fmt.Println(string(message))
		if err != nil {
			log.Fatal("JSON UNMARSHAL FAILED: ", err)
		}
		fmt.Println(string(message))

		var getInterfacesResult [][2]string
		var setInterfacesResult []byte
		var getOSResult string
		var getHostnameResult string
		var requireSetupWinResult bool

		switch request.Name {
		case "getInterfaces":
			getInterfacesResult = getInterfaces(request.Parameters)
		case "setInterfaces":
			setInterfacesResult = setInterfaces(request.Parameters)
		case "getOS":
			getOSResult = getOS(request.Parameters)
		case "getHostname":
			getHostnameResult = getHostname(request.Parameters)
		case "requireSetupWin":
			requireSetupWinResult = requireSetupWin(request.Parameters)
		}

		response, err := json.Marshal(ResourceResponse{request.Name, ResponseContent{getInterfacesResult, setInterfacesResult, getOSResult, getHostnameResult, requireSetupWinResult}})
		fmt.Println(string(response))
		if err != nil {
			log.Fatal("MARSHAL FAILED: ", err)
		}

		err = conn.WriteMessage(websocket.TextMessage, response)
		if err != nil {
			log.Fatal("WRITE FAILED: ", err)
			break
		}
	}
}

func getInterfaces(parameters ResourceParameters) [][2]string {
	out, err := exec.Command("netsh", "interface", "ipv4", "show", "joins").Output()
	if err != nil {
		log.Fatal(err)
	}
	output := strings.Split(string(out), "\n")
	interfaces := make([]string, 0)
	for _, line := range output {
		if strings.Contains(line, "Interface") {
			interfaces = append(interfaces, line)
		}
	}
	response := make([][2]string, len(interfaces))
	for i, line := range interfaces {
		lineInfo := strings.Split(line, ": ")
		response[i] = [2]string{strings.ReplaceAll(lineInfo[0], "Interface ", ""), lineInfo[1]}
	}
	return response
}

func setInterfaces(parameters ResourceParameters) []byte {
	dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(dir+"\\"+"SetMulticastWin.exe", "--interface "+strconv.Itoa(parameters.InterfaceID), "--path "+dir+"\\"+"ftx.exe")
	out, err := exec.Command(dir+"\\"+"SetMulticastWin.exe", "--interface "+strconv.Itoa(parameters.InterfaceID), "--path "+dir+"\\"+"ftx.exe").Output()
	return out
}

func getOS(parameters ResourceParameters) string {
	return runtime.GOOS
}

func getHostname(parameters ResourceParameters) string {
	Name, err := os.Hostname()
	if err != nil {
		log.Fatal(err)
	}
	return Name
}

func requireSetupWin(parameters ResourceParameters) bool {
	required := true
	out, err := exec.Command("powershell.exe", "Get-NetRoute").Output()
	lines := []string{}
	for _, line := range strings.Split(string(out), "\r\n") {
		if strings.Contains(line, "224.0.0.0") {
			lines = append(lines, line)
		}
	}

	for i := 0; i < len(lines); i++ {
		if strings.Fields(lines[i])[3] != "256" {
			required = false
			break
		}
	}

	err = exec.Command("powershell.exe", "Get-NetFirewallRule", "-DisplayName \"FTX\"").Run()
	if err != nil {
		required = true
	}
	return required
}

func updateUsers(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal("UPGRADE FAILED: ", err)
		return
	}
	for {
		msg := <-multicastChannel
		messageType := msg.content[0]
		if messageType == 0 {
			userName := string(msg.content[1:])
			res, err := json.Marshal(UserResponse{"addUser", userName, msg.src.IP.String()})
			if err != nil {
				log.Fatal("JSON MARSHAL FAILED: ", err)
				return
			}
			conn.WriteMessage(websocket.TextMessage, res)
		}
	}
}
