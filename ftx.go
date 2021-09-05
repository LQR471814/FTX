package ftx

import (
	"context"
	"ftx/peers"
	"log"
	"net"
	"net/http"
	_ "net/http/pprof"

	"github.com/gorilla/websocket"
)

const (
	buffer         = 1024
	multicastGroup = "224.0.0.248:5001"
)

type State struct {
	peers []*peers.Peer
}

var upgrader = websocket.Upgrader{}
var settings = &Settings{}
var server = &http.Server{Addr: ":3000", Handler: nil}
var updateUserConns = []*websocket.Conn{}
var recvMessageConns = []*websocket.Conn{}

func main() {
	ctx := context.WithValue(context.Background(), "state", &State{})

	//? Debug
	// runtime.SetBlockProfileRate(1000000000)
	// go func() {
	// 	log.Println(http.ListenAndServe("0.0.0.0:6060", nil))
	// }()
	// log.SetFlags(log.LstdFlags | log.Lshortfile)

	settings.Load()

	if settings.Interface != 1 {
		//? Setup Multicasting
		netInterface, err := net.InterfaceByIndex(settings.Interface)
		if err != nil {
			log.Fatal(err)
		}

		grpAddr, err := net.ResolveUDPAddr("udp", multicastGroup)
		if err != nil {
			log.Fatal(err)
		}
	}

	//? Start frontend
	http.Handle("/", LimitHandler{http.FileServer(http.Dir("./build"))})
	http.HandleFunc("/sendFile", recvFile)
	http.HandleFunc("/resource", resource)
	http.HandleFunc("/updateUsers", updateUsers)
	http.HandleFunc("/recvMessage", recvMessage)

	log.Default().Println("Serving on port", server.Addr)
	server.ListenAndServe()
}
