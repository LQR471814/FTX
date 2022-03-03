package transfer

import (
	"ftx/backend/state"
	"log"

	wsftp "github.com/LQR471814/websocket-ftp/server"
)

type TransferHandler struct {
	state *state.State
}

func (h TransferHandler) OnTransferRequest(t *wsftp.Transfer) chan bool {
	request := ToRequest(t)
	log.Println("Transfer request", t.Data)
	for _, c := range h.state.TransferRequestChannels {
		c.Send(request)
	}

	ch := make(chan bool, 1)
	h.state.PendingTransfers[request.Id] = ch
	return ch
}

func (h TransferHandler) OnTransferUpdate(t *wsftp.Transfer) {
	for _, c := range h.state.TransferUpdateChannels {
		c.Send(ToState(t))
	}
}

func (h TransferHandler) OnTransferComplete(t *wsftp.Transfer, f wsftp.File) {}

func (h TransferHandler) OnAllTransfersComplete(t *wsftp.Transfer) {
	log.Println(t)
	for _, c := range h.state.FinishTransferChannels {
		c.Send(ToState(t))
	}
}

func Serve(s *state.State) {
	server := wsftp.NewServer(wsftp.ServerConfig{
		Handlers: TransferHandler{state: s},
	})
	server.ServeWith(s.FileListener)
}
