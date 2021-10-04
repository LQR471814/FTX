package main

import (
	"fmt"
	"ftx/backend/transfer"
	"net/http"
)

func main() {
	http.HandleFunc("/sendFile", transfer.Handler)
	fmt.Println("Listening and serving on port 7777")
	http.ListenAndServe("localhost:7777", nil)
}
