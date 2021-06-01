package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/websocket"
)

const FILE_REQUEST_TYPE = "file_requests"
const UPLOAD_CONFIRMATION_TYPE = "upload_confirmation"
const UPLOAD_DENY_TYPE = "upload_deny"
const START_UPLOAD_TYPE = "start_upload"
const TRANSFERRED_CONFIRMATION_TYPE = "transferred_confirmation"

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

func recvFile(w http.ResponseWriter, r *http.Request) { //% State: Initial
	conn, err := upgrader.Upgrade(w, r, nil) //? Event: onpeerconnect
	if err != nil {
		log.Println(err)
		return
	}

	requestFileList := &CumulativeFileRequests{}
	fileContents := map[int64][]byte{}

	var currentRecvFileIndex int64 = 0
	receivedBytes := 0

	//* Action: dsr

	for {
		msgType, payload, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		if msgType == websocket.TextMessage {
			status := &FileTransferStatus{}
			json.Unmarshal(payload, status)

			fmt.Println(status)

			switch status.Type {
			case FILE_REQUEST_TYPE:
				json.Unmarshal([]byte(status.Payload), requestFileList)

				response, _ := json.Marshal(FileTransferStatus{Type: UPLOAD_CONFIRMATION_TYPE})

				//% State: Waiting for User Confirmation

				fmt.Println(string(response))
				conn.WriteMessage(websocket.TextMessage, response) //* Action: scd

				//% State: Waiting for Start Upload Signal
			case START_UPLOAD_TYPE:
				receivedBytes = 0
				currentRecvFileIndex, _ = strconv.ParseInt(status.Payload, 10, 64)
			}
		} else {
			receivedBytes += len(payload)
			fileContents[currentRecvFileIndex] = append(fileContents[currentRecvFileIndex], payload...)

			//? Event: onrecvallfilecontents
			if receivedBytes >= requestFileList.Files[currentRecvFileIndex].Size {
				response, _ := json.Marshal(
					FileTransferStatus{
						Type:    TRANSFERRED_CONFIRMATION_TYPE,
						Payload: requestFileList.Files[currentRecvFileIndex].Filename,
					},
				)

				conn.WriteMessage(websocket.TextMessage, response)

				receivedBytes = 0
				currentRecvFileIndex += 1
				if currentRecvFileIndex >= int64(len(requestFileList.Files)) {
					currentRecvFileIndex = 0
				}
			}
		}
	}
}
