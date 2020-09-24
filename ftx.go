package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"

	"golang.org/x/net/ipv4"

	"github.com/gorilla/websocket"
)

const (
	buffer = 1024
)

var multicastGroup = net.IPv4(224, 0, 2, 20)

//MulticastPacket contains information for a given multicast packet received
type MulticastPacket struct {
	content []byte
	src     net.Addr
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
	GetOS           string
	GetHostname     string
	RequireSetupWin bool
}

//ResourceParameters defines the parameters passed to a resource request
type ResourceParameters struct {
	InterfaceID int
}

//Settings define the program settings
type Settings struct {
	InterfaceID int
}

//Defaults restores Settings to defaults
func (settings *Settings) Defaults() {
	settings.InterfaceID = 1
}

var upgrader = websocket.Upgrader{}
var multicastChannel = make(chan MulticastPacket)

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	//Load settings
	f, err := os.Create("settings.json")
	if err != nil {
		log.Fatal(err)
	}

	f.Close()

	data, err := ioutil.ReadFile("settings.json")
	if err != nil {
		fmt.Println(err)
	}

	settings := &Settings{}
	settings.Defaults()
	err = json.Unmarshal(data, settings)

	netInterface, err := net.InterfaceByIndex(settings.InterfaceID)
	if err != nil {
		log.Fatal(err)
	}

	conn, err := net.ListenPacket("udp4", "0.0.0.0:0")
	if err != nil {
		log.Fatal(err)
	}
	packetConn := ipv4.NewPacketConn(conn)
	if err := packetConn.JoinGroup(netInterface, &net.UDPAddr{IP: multicastGroup}); err != nil {
		log.Fatal(err)
	}
	packetConn.SetMulticastInterface(netInterface)

	go serveMulticastUDP(packetConn)
	ping(append([]byte{0}, []byte(getHostname(ResourceParameters{}))...))

	http.Handle("/", http.FileServer(http.Dir("./build")))
	http.HandleFunc("/resource", resource)
	http.HandleFunc("/updateUsers", updateUsers)
	http.ListenAndServe(":3000", nil)
}

func ping(bytes []byte) {
	addr, err := net.ResolveUDPAddr("udp4", multicastGroup.String()+":0")
	if err != nil {
		log.Fatal(err)
	}
	conn, err := net.DialUDP("udp4", nil, addr)
	conn.Write(bytes)
	conn.Close()
}

func serveMulticastUDP(packetConn *ipv4.PacketConn) {
	bytes := make([]byte, buffer)
	for {
		_, cm, src, err := packetConn.ReadFrom(bytes)
		if err != nil {
			log.Fatal(err)
		}
		if cm.Dst.IsMulticast() {
			if cm.Dst.Equal(multicastGroup) {
				fmt.Println(MulticastPacket{bytes, src})
				multicastChannel <- MulticastPacket{bytes, src}
			} else {
				continue
			}
		}
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
		var getOSResult string
		var getHostnameResult string
		var requireSetupWinResult bool

		switch request.Name {
		case "getInterfaces":
			getInterfacesResult = getInterfaces(request.Parameters)
		case "setInterfaces":
			setInterfaces(request.Parameters)
		case "getOS":
			getOSResult = getOS(request.Parameters)
		case "getHostname":
			getHostnameResult = getHostname(request.Parameters)
		case "requireSetupWin":
			requireSetupWinResult = requireSetupWin(request.Parameters)
		}

		response, err := json.Marshal(ResourceResponse{request.Name, ResponseContent{getInterfacesResult, getOSResult, getHostnameResult, requireSetupWinResult}})
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
	interfaces, err := net.Interfaces()
	if err != nil {
		log.Fatal(err)
	}
	response := make([][2]string, len(interfaces))
	for i, itf := range interfaces {
		response[i] = [2]string{strconv.Itoa(itf.Index), itf.Name}
	}
	return response
}

func setInterfaces(parameters ResourceParameters) {

	if runtime.GOOS == "windows" {
		dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println(dir+"\\"+"SetMulticastWin.exe", "--interface "+strconv.Itoa(parameters.InterfaceID), "--path "+dir+"\\"+"ftx.exe")
		out, err := exec.Command(dir+"\\"+"SetMulticastWin.exe", "--interface "+strconv.Itoa(parameters.InterfaceID), "--path "+dir+"\\"+"ftx.exe").Output()
		fmt.Println(out)
	}
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
			res, err := json.Marshal(UserResponse{"addUser", userName, msg.src.String()})
			if err != nil {
				log.Fatal("JSON MARSHAL FAILED: ", err)
				return
			}
			conn.WriteMessage(websocket.TextMessage, res)
		}
	}
}
