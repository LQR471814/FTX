package main

import (
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
