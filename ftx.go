package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	_ "net/http/pprof"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

const (
	buffer = 1024
)

var multicastGroup = "224.0.0.248:5001"

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
	GetInterfaces [][2]string
	GetOS         string
	GetHostname   string
	RequireSetup  bool
}

//ResourceParameters defines the parameters passed to a resource request
type ResourceParameters struct {
	InterfaceID int
}

//Settings define the program settings
type Settings struct {
	InterfaceID int
	Default     bool
	Mux         sync.Mutex
	File        *os.File
}

type state struct {
	MulticastPeers []*UserResponse
	Mux            sync.Mutex
}

//Defaults restores Settings to defaults
func (settings *Settings) Defaults() {
	settings.Mux.Lock()
	settings.InterfaceID = 1
	settings.Default = true
	settings.Mux.Unlock()
}

var upgrader = websocket.Upgrader{}
var multicastChannel = make(chan MulticastPacket)
var settings = &Settings{}
var server = &http.Server{Addr: ":3000", Handler: nil}
var updateUserConns = []*websocket.Conn{}
var mainState = &state{}

func main() {
	ctx, _ := context.WithCancel(context.Background())

	//? Debug
	runtime.SetBlockProfileRate(1000000000)
	go func() {
		log.Println(http.ListenAndServe("0.0.0.0:6060", nil))
	}()
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	//? Load settings
	data, err := ioutil.ReadFile("settings.json")
	if err != nil {
		settings.File, err = os.Create("settings.json")
		if err != nil {
			log.Fatal(err)
		}
	}
	settings.File, err = os.OpenFile("settings.json", os.O_RDWR, 0755)
	if err != nil {
		log.Fatal(err)
	}

	settings.Defaults()
	fmt.Println(string(data))
	err = json.Unmarshal(data, settings)
	fmt.Println(settings)

	//? Initialize state
	mainState.MulticastPeers = []*UserResponse{}

	if settings.InterfaceID != 1 {
		//? Setup Multicasting
		netInterface, err := net.InterfaceByIndex(settings.InterfaceID)
		if err != nil {
			log.Fatal(err)
		}

		grpAddr, err := net.ResolveUDPAddr("udp", multicastGroup)

		//? Start Multicast
		conn, err := net.ListenMulticastUDP("udp4", netInterface, grpAddr)
		if err != nil {
			log.Fatal(err)
		}

		go serveMulticastUDP(ctx, grpAddr, conn, mainState)
		go keepAlive(ctx, grpAddr, conn)
		ping(conn, append([]byte{0}, []byte(getHostname(ResourceParameters{}))...), grpAddr)
		defer ping(conn, append([]byte{2}, []byte(getHostname(ResourceParameters{}))...), grpAddr)
	}

	//? Start frontend
	http.Handle("/", http.FileServer(http.Dir("./build")))
	http.HandleFunc("/resource", resource)
	http.HandleFunc("/updateUsers", updateUsers)
	server.ListenAndServe()
}

//! Miscellaneous
func writeSettings() {
	settings.Mux.Lock()
	data, err := json.Marshal(settings)
	if err != nil {
		log.Fatal(err)
	}
	n, err := settings.File.Write(data)
	fmt.Println(strconv.Itoa(n), "bytes written.")
	if err != nil {
		log.Fatal(err)
	}
	settings.File.Sync()
	settings.Mux.Unlock()
}

//! Multicasting
func ping(conn *net.UDPConn, buf []byte, grpAddr *net.UDPAddr) {
	_, err := conn.WriteToUDP(buf, grpAddr)
	if err != nil {
		log.Fatal(err)
	}
}

func keepAlive(ctx context.Context, grpAddr *net.UDPAddr, conn *net.UDPConn) {
	for {
		select {
		case <-ctx.Done():
			break
		default:
			ping(conn, append([]byte{0}, []byte(getHostname(ResourceParameters{}))...), grpAddr)
			time.Sleep(time.Second * 5)
		}
	}
}

func serveMulticastUDP(ctx context.Context, grpAddr *net.UDPAddr, conn *net.UDPConn, mainState *state) {
serveLoop:
	for {
		select {
		case <-ctx.Done():
			break
		default:
			buf := make([]byte, buffer)
			conn.SetReadDeadline(time.Now().Add(1 * time.Second))
			_, src, err := conn.ReadFromUDP(buf)
			if err != nil && !strings.Contains(err.Error(), "i/o timeout") {
				log.Fatal(err)
			}
			msgBytes := bytes.TrimRight(buf, "\x00")
			if msgBytes != nil && len(msgBytes) != 0 { //? If the multicast received is not null or empty
				messageType := msgBytes[0]
				if messageType == 0 { //? On user joins multicast peers
					userName := string(msgBytes[1:])
					for _, user := range mainState.MulticastPeers {
						if user.Name == userName && user.IP == src.String() {
							continue serveLoop
						}
					}
					fmt.Println(string(msgBytes), src)
					ping(conn, append([]byte{0}, []byte(getHostname(ResourceParameters{}))...), grpAddr)
					mainState.Mux.Lock()
					mainState.MulticastPeers = append(mainState.MulticastPeers, &UserResponse{"addUser", userName, src.String()})
					mainState.Mux.Unlock()
					res, err := json.Marshal(UserResponse{"addUser", userName, src.String()})
					if err != nil {
						log.Fatal("JSON MARSHAL FAILED: ", err)
						return
					}
					for _, websocketConn := range updateUserConns {
						websocketConn.WriteMessage(websocket.TextMessage, res)
					}
				}
				if messageType == 1 { //? If received keepalive
					ping(conn, append([]byte{0}, []byte(getHostname(ResourceParameters{}))...), grpAddr)
				}
				if messageType == 2 { //? On user quit multicast peers
					userName := string(msgBytes[1:])
					for i, user := range mainState.MulticastPeers {
						if user.IP == src.String() && user.Name == userName {
							mainState.Mux.Lock()
							mainState.MulticastPeers = append(mainState.MulticastPeers[:i], mainState.MulticastPeers[i+1:]...)
							mainState.Mux.Unlock()

							res, err := json.Marshal(UserResponse{"removeUser", userName, src.String()})
							if err != nil {
								log.Fatal("JSON MARSHAL FAILED: ", err)
								return
							}
							for _, websocketConn := range updateUserConns {
								websocketConn.WriteMessage(websocket.TextMessage, res)
							}
							break
						}
					}
				}
			}
		}
	}
}

//! Websocket Handlers
func updateUsers(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal("UPGRADE FAILED: ", err)
		return
	}
	updateUserConns = append(updateUserConns, conn)
	for _, user := range mainState.MulticastPeers {
		res, err := json.Marshal(user)
		if err != nil {
			log.Fatal(err)
		}
		conn.WriteMessage(websocket.TextMessage, res)
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
			fmt.Println("Quitting...")
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
		var requireSetupResult bool

		switch request.Name {
		case "getInterfaces":
			getInterfacesResult = getInterfaces(request.Parameters)
		case "setInterfaces":
			setInterfaces(request.Parameters)
		case "getOS":
			getOSResult = getOS(request.Parameters)
		case "getHostname":
			getHostnameResult = getHostname(request.Parameters)
		case "requireSetup":
			requireSetupResult = requireSetup(request.Parameters)
		}

		response, err := json.Marshal(ResourceResponse{request.Name, ResponseContent{getInterfacesResult, getOSResult, getHostnameResult, requireSetupResult}})
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
	writeSettings()
	settings.File.Close()
	server.Shutdown(context.Background())
}

//! Resource Functions
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
	settings.Mux.Lock()
	settings.InterfaceID = parameters.InterfaceID
	settings.Default = false
	settings.Mux.Unlock()

	if runtime.GOOS == "windows" {
		dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println(dir+"\\"+"SetMulticast.exe", "--interface "+strconv.Itoa(parameters.InterfaceID), "--path "+dir+"\\"+"ftx.exe")
		out, err := exec.Command(dir+"\\"+"SetMulticast.exe", "--interface "+strconv.Itoa(parameters.InterfaceID), "--path "+dir+"\\"+"ftx.exe").Output()
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

func requireSetup(parameters ResourceParameters) bool {
	required := true
	if settings.Default == true {
		required = true
	} else {
		required = false
	}

	if runtime.GOOS == "windows" {
		required = true
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
	}

	return required
}
