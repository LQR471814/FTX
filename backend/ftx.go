package main

import (
	"ftx/backend/state"
	"log"
)

//lint:ignore U1000 main should be used
func main() {
	state, err := state.CreateState("224.0.0.248:5001")
	if err != nil {
		panic(err)
	}

	guiListener := state.Listeners["gui"]
	fileListener := state.Listeners["file"]

	log.Println("Serving filerecv on", state.ListenerPort("file"))
	log.Println("Serving gui on", state.ListenerPort("gui"))

	go PeerListen(state)

	go ServeFile(fileListener)
	ServeGUI(state, guiListener)
}
