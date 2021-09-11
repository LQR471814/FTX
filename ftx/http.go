package main

import (
	"log"
	"main/api"
	"main/files"
	"main/paths"
	"main/state"
	"net"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"google.golang.org/grpc"
)

//LimitHandler limits requests incoming to the given redirect to localhost
type LimitHandler struct {
	redirect http.Handler
}

func (h LimitHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Println(r.RemoteAddr)
	trueAddr, err := net.ResolveTCPAddr("tcp", r.RemoteAddr)
	if err != nil {
		panic(err)
	}

	if trueAddr.IP.IsLoopback() {
		h.redirect.ServeHTTP(w, r)
	} else {
		w.Write([]byte("Access denied"))
	}
}

func SplitGRPCTraffic(fallback http.HandlerFunc, grpcHandler http.Handler) http.HandlerFunc {
	return http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			if strings.Contains(r.Header.Get("Content-Type"), "application/grpc") ||
				websocket.IsWebSocketUpgrade(r) {
				grpcHandler.ServeHTTP(w, r)
				return
			}

			fallback(w, r)
		},
	)
}

func ServeGUI(state *state.State, listener net.Listener) {
	//? GUI Folder Setup
	guiPath, err := paths.WithDirectory("build")
	if err != nil {
		panic(err)
	}

	fs := http.FileServer(http.Dir(guiPath))

	//? GRPC Setup
	gRPCServer := grpc.NewServer()
	api.RegisterBackendServer(
		gRPCServer,
		&BackendServer{
			state: state,
		},
	)

	wrappedServer := grpcweb.WrapServer(
		gRPCServer,
		grpcweb.WithWebsockets(true),
	)

	server := http.Server{
		Handler: LimitHandler{
			redirect: SplitGRPCTraffic(fs.ServeHTTP, wrappedServer),
		},
	}

	server.Serve(listener)
}

func ServeFile(listener net.Listener) {
	mux := http.NewServeMux()
	mux.HandleFunc("/", files.FileHandler)

	server := http.Server{
		Handler: mux,
	}

	server.Serve(listener)
}
