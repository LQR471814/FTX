package main

import (
	"fmt"
	"net/http"
)

//LimitHandler limits requests incoming to the given redirect to localhost
type LimitHandler struct {
	redirect http.Handler
}

func (h LimitHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if isLocal(r.RemoteAddr) {
		h.redirect.ServeHTTP(w, r)
	} else {
		w.Write([]byte("Access denied"))
	}
}

func sendFile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	if r.Method == "POST" {
		r.ParseForm()
		fmt.Println(r.Form)
	} else {
		w.Write([]byte("Only POST requests are supported!"))
	}
}
