package ftx

import (
	"ftx/state"
	"log"
)

//lint:ignore U1000 main should be used
func main() {
	grpcListener := state.Current().Listeners["grpc"]
	guiListener := state.Current().Listeners["gui"]
	fileListener := state.Current().Listeners["file"]

	log.Println("Serving grpc on", state.ListenerPort("grpc"))
	log.Println("Serving filerecv on", state.ListenerPort("file"))
	log.Println("Serving gui on", state.ListenerPort("gui"))

	go ServeGRPC(grpcListener)
	go ServeFile(fileListener)
	ServeGUI(guiListener)
}
