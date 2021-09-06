package ftx

import (
	"ftx/state"
	"log"
)

//lint:ignore U1000 main should be used
func main() {
	state, err := state.CreateState("224.0.0.248:5001")
	if err != nil {
		panic(err)
	}

	grpcListener := state.Listeners["grpc"]
	guiListener := state.Listeners["gui"]
	fileListener := state.Listeners["file"]

	log.Println("Serving grpc on", state.ListenerPort("grpc"))
	log.Println("Serving filerecv on", state.ListenerPort("file"))
	log.Println("Serving gui on", state.ListenerPort("gui"))

	go ServeGRPC(state, grpcListener)
	go ServeFile(fileListener)
	ServeGUI(state, guiListener)
}
