package transfer

import (
	"bufio"
	"encoding/json"
	"ftx/backend/api"
	"log"
	"net"
	"net/http"
	"os"
	"strings"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type TransferHandlers interface {
	OnTransferRequest(*api.TransferRequest) chan bool
	OnTransferUpdate(*api.TransferState)
}

type TransferRequest struct {
	RemoteAddr net.Addr
	Files      []File
}

var upgrader = websocket.Upgrader{
	CheckOrigin:     func(*http.Request) bool { return true }, //? Allow cross-origin requests
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var handlers TransferHandlers

func sendJSON(c *websocket.Conn, obj interface{}) {
	msg, err := json.Marshal(obj)
	if err != nil {
		log.Println("WARN:", err)
		return
	}

	c.WriteMessage(websocket.TextMessage, msg)
}

func fileWriter(filename string, fileSize int, datachan chan []byte) {
	f, err := os.Create(filename)
	if err != nil {
		log.Fatal(err)
	}

	writtenBytes := 0
	w := bufio.NewWriterSize(f, 1024*1024*50) //? Buffsize = 50 mB

	for data := range datachan {
		w.Write(data)

		writtenBytes += len(data)
		if writtenBytes >= fileSize {
			log.Printf("Wrote %v to disk\n", filename)

			w.Flush()
			f.Close()
			return
		}
	}
}

func Handler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil) //? Event: onpeerconnect
	if err != nil {
		log.Fatal(err)
	}

	transfer := &Transfer{
		From: conn.RemoteAddr(),
		ID:   uuid.New().String(),
		conn: conn,
	}

	eventHandler(transfer, peerConnect)

	for {
		updateOffset := transfer.Files[transfer.CurrentFile].Size / 8
		updateNext := updateOffset

		msgType, contents, err := conn.ReadMessage()
		if err != nil {
			if strings.Contains(err.Error(), "close") {
				return
			}
			panic(err)
		}

		switch msgType {
		case websocket.TextMessage:
			//? This will 100% come back to bite me later but this should be fine for now
			reqs := &FileRequests{}
			json.Unmarshal(contents, reqs)
			transfer.Files = reqs.Files

			eventHandler(transfer, recvRequests)
		case websocket.BinaryMessage:
			f := transfer.Files[transfer.CurrentFile]
			transfer.dataChan <- contents
			transfer.Received += len(contents)

			if transfer.Received > updateNext {
				handlers.OnTransferUpdate(transfer.ToState())
				updateNext += updateOffset
			}

			if transfer.Received >= f.Size {
				eventHandler(transfer, recvDone)
			}
		}
	}
}

func eventHandler(t *Transfer, event Event) {
	cell, ok := EventStateMatrix[event][t.State]
	log.Println(event, t.State, cell)
	if !ok {
		log.Println("Cell doesn't exist under these circumstances")
		return
	}

	t.State = cell.NewState
	for _, action := range cell.Actions {
		actionHandler(t, action)
	}
}

func actionHandler(t *Transfer, action Action) {
	switch action {
	case DisplayFileRequests:
		log.Println(t.Files)

		accept := <-handlers.OnTransferRequest(t.ToRequest())
		if accept {
			eventHandler(t, userAccept)
			return
		}

		eventHandler(t, userDeny)
	case IncrementFileIndex:
		t.CurrentFile += 1
	case SendStartSignal:
		sendJSON(t.conn, Signal{
			Type: "start",
		})
	case SendExitSignal:
		sendJSON(t.conn, Signal{
			Type: "exit",
		})
	case SendFinishedSignal:
		sendJSON(t.conn, Signal{
			Type: "complete",
		})
	case StartFileWriter:
		f := t.Files[t.CurrentFile]
		t.dataChan = make(chan []byte)
		go fileWriter(f.Name, f.Size, t.dataChan)
	case StopFileWriter:
		close(t.dataChan)
	case RecvDoneHandler:
		if t.CurrentFile >= len(t.Files) {
			return
		}

		actionHandler(t, StartFileWriter)
		actionHandler(t, SendStartSignal)
	}
}

func Listen(listener net.Listener, h TransferHandlers) {
	handlers = h
	server := http.Server{Handler: http.HandlerFunc(Handler)}
	server.Serve(listener)
}
