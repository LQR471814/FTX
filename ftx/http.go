package ftx

import (
	"ftx/files"
	"ftx/paths"
	"ftx/state"
	"log"
	"net"
	"net/http"
	"strconv"
)

//WithCookie adds a cookie to the response of the request
type WithCookie struct {
	redirect http.Handler
	cookie   *http.Cookie
}

func (h WithCookie) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, h.cookie)
	h.redirect.ServeHTTP(w, r)
}

//LimitHandler limits requests incoming to the given redirect to localhost
type LimitHandler struct {
	redirect http.Handler
}

func (h LimitHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Default().Println(r.RemoteAddr)

	if isLocal(r.RemoteAddr) {
		h.redirect.ServeHTTP(w, r)
	} else {
		w.Write([]byte("Access denied"))
	}
}

func ServeGUI(state *state.State, listener net.Listener) {
	guiPath, err := paths.WithDirectory("build")
	if err != nil {
		panic(err)
	}

	fs := http.FileServer(http.Dir(guiPath))
	server := http.Server{
		Handler: WithCookie{
			redirect: LimitHandler{
				redirect: fs,
			},
			cookie: &http.Cookie{
				Name:  "GRPC_PORT",
				Value: strconv.Itoa(state.ListenerPort("grpc")),
			},
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
