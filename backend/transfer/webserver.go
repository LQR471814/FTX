package transfer

import (
	"bufio"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"

	"ftx/backend/netutils"

	"github.com/gorilla/websocket"
)

type Transfer struct {
	state       State
	files       []File
	currentFile int
	dataChan    chan []byte
	received    int
	conn        *websocket.Conn
}

var upgrader = websocket.Upgrader{
	CheckOrigin:     func(*http.Request) bool { return true }, //? Allow cross-origin requests
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

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

	transfer := &Transfer{conn: conn}
	eventHandler(transfer, peerConnect)

	for {
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
			transfer.files = reqs.Files

			eventHandler(transfer, recvRequests)
		case websocket.BinaryMessage:
			f := transfer.files[transfer.currentFile]
			transfer.dataChan <- contents
			transfer.received += len(contents)

			if transfer.received >= f.Size {
				eventHandler(transfer, recvDone)
			}
		}
	}
}

func eventHandler(t *Transfer, event Event) {
	cell, ok := EventStateMatrix[event][t.state]
	log.Println(event, t.state, cell)
	if !ok {
		log.Println("Cell doesn't exist under these circumstances")
		return
	}

	t.state = cell.NewState
	for _, action := range cell.Actions {
		actionHandler(t, action)
	}
}

func actionHandler(t *Transfer, action Action) {
	switch action {
	case DisplayFileRequests: //TODO: Add user input code here
		log.Println(t.files)
		eventHandler(t, userAccept) //TODO: Remove this later
	case IncrementFileIndex:
		t.currentFile += 1
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
		f := t.files[t.currentFile]
		t.dataChan = make(chan []byte)
		go fileWriter(f.Name, f.Size, t.dataChan)
	case StopFileWriter:
		close(t.dataChan)
	case RecvDoneHandler:
		if t.currentFile >= len(t.files) {
			return
		}

		actionHandler(t, StartFileWriter)
		actionHandler(t, SendStartSignal)
	}
}

func Listen(port int) {
	http.HandleFunc("/sendFile", Handler)
	http.ListenAndServe(netutils.ConstructAddrStr(nil, port), nil)
}
