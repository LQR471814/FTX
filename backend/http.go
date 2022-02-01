package main

import (
	"ftx/backend/api"
	"ftx/backend/paths"
	"ftx/backend/state"
	"log"
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
	trueAddr, err := net.ResolveTCPAddr("tcp", r.RemoteAddr)
	if err != nil {
		log.Fatal(err)
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
		log.Fatal(err)
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

	wrappedServer := grpcweb.WrapServer(gRPCServer)

	server := http.Server{
		Handler: LimitHandler{
			redirect: SplitGRPCTraffic(
				func(w http.ResponseWriter, r *http.Request) {
					if strings.HasSuffix(r.RequestURI, ".js") {
						w.Header().Set("Content-Type", "text/javascript")
					}
					fs.ServeHTTP(w, r)
				},
				wrappedServer,
			),
		},
	}

	server.Serve(listener)
}
