package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gorilla/websocket"
)

//? Valid transfer status types
//* file_requests
//* upload_confirmation
//* transferred_confirmation

const FILE_REQUEST_TYPE = "file_requests"
const UPLOAD_CONFIRMATION_TYPE = "upload_confirmation"
const UPLOAD_DENY_TYPE = "upload_deny"
const START_UPLOAD_TYPE = "start_upload"
const TRANSFERRED_CONFIRMATION_TYPE = "transferred_confirmation"

var upgrader = websocket.Upgrader{
	CheckOrigin:     func(*http.Request) bool { return true }, //? Allow cross-origin requests
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type FileSendRequest struct {
	Filename string
	Size     int
}

type CumulativeFileRequests struct {
	From  string
	Files []FileSendRequest
}

type FileTransferStatus struct {
	Type    string
	Payload string
}

func fileWriterWorker(filename string, fileSize int, datachan chan []byte) {
	f, err := os.Create(filename)
	if err != nil {
		log.Fatal(err)
	}

	writtenBytes := 0
	w := bufio.NewWriterSize(f, 1024*1024*50)

	for {
		data := <-datachan
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

func handler(w http.ResponseWriter, r *http.Request) { //% State: Initial
	conn, err := upgrader.Upgrade(w, r, nil) //? Event: onpeerconnect
	if err != nil {
		log.Fatal(err)
	}

	requestFileList := &CumulativeFileRequests{}

	var writeDataChannel chan []byte
	var currentRecvFileIndex int64
	var receivedBytes int

	//* Action: dsr

	for {
		msgType, payload, err := conn.ReadMessage()
		if err != nil {
			log.Fatal(err)
		}

		if msgType == websocket.TextMessage {
			status := &FileTransferStatus{}
			json.Unmarshal(payload, status)

			log.Println(status)

			switch status.Type {
			case FILE_REQUEST_TYPE:
				json.Unmarshal([]byte(status.Payload), requestFileList)

				response, _ := json.Marshal(FileTransferStatus{Type: UPLOAD_CONFIRMATION_TYPE})

				//% State: Waiting for User Confirmation

				err := conn.WriteMessage(websocket.TextMessage, response) //* Action: scd
				if err != nil {
					log.Fatal(err)
				}

				//% State: Waiting for Start Upload Signal
			case START_UPLOAD_TYPE:
				receivedBytes = 0
				currentRecvFileIndex, _ = strconv.ParseInt(status.Payload, 10, 64)

				currentFile := requestFileList.Files[currentRecvFileIndex]

				writeDataChannel = make(chan []byte)
				go fileWriterWorker(
					currentFile.Filename,
					currentFile.Size,
					writeDataChannel,
				)
			}
		} else {
			receivedBytes += len(payload)
			writeDataChannel <- payload

			//? Event: onrecvallfilecontents
			if receivedBytes >= requestFileList.Files[currentRecvFileIndex].Size {
				receivedBytes = 0
				response, _ := json.Marshal(
					FileTransferStatus{
						Type:    TRANSFERRED_CONFIRMATION_TYPE,
						Payload: requestFileList.Files[currentRecvFileIndex].Filename,
					},
				)

				err := conn.WriteMessage(websocket.TextMessage, response)
				if err != nil {
					log.Fatal(err)
				}

				currentRecvFileIndex += 1
				if currentRecvFileIndex >= int64(len(requestFileList.Files)) {
					currentRecvFileIndex = 0
				}
			}
		}
	}
}

func main() {
	serveIp := ":7777"

	http.HandleFunc("/sendFile", handler)
	fmt.Println("Serving on: " + serveIp)
	http.ListenAndServe(serveIp, nil)
}
