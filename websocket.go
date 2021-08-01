package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"runtime"

	"github.com/gorilla/websocket"
)

//MessageResponse defines the information sent when message is received
type MessageResponse struct {
	User    string
	Message string
}

//UserResponse defines the information returned when user update occurs
type UserResponse struct {
	MsgType string
	Name    string
	IP      string
}

func updateUsers(w http.ResponseWriter, r *http.Request) {
	if isLocal(r.RemoteAddr) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Fatal("UPGRADE FAILED: ", err)
		}

		updateUserConns = append(updateUserConns, conn)

		for _, user := range mainState.MulticastPeers {
			res, err := json.Marshal(user)
			if err != nil {
				log.Fatal(err)
			}

			conn.WriteMessage(websocket.TextMessage, res)
		}
	}
}

func recvMessage(w http.ResponseWriter, r *http.Request) {
	if isLocal(r.RemoteAddr) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Fatal("UPGRADE FAILED: ", err)
		}

		recvMessageConns = append(recvMessageConns, conn)
	}
}

func resource(w http.ResponseWriter, r *http.Request) {
	if isLocal(r.RemoteAddr) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Fatal("UPGRADE FAILED: ", err)
		}

		for {
			_, message, err := conn.ReadMessage()
			if err != nil { //? On websocket disconnected
				log.Println("Resource closed")
				break
			}

			request := ResourceRequest{}
			err = json.Unmarshal(message, &request)
			if err != nil {
				log.Fatal("JSON UNMARSHAL FAILED: ", err)
			}
			fmt.Println(string(message))

			var getInterfacesResult [][3]string
			var getOSResult string
			var getHostnameResult string
			var requireSetupResult bool

			switch request.Name {
			case "getInterfaces":
				getInterfacesResult = getInterfaces()
			case "setInterfaces":
				setInterfaces(request.Parameters)
			case "getOS":
				getOSResult = runtime.GOOS
			case "getHostname":
				getHostnameResult = getHostname()
			case "requireSetup":
				requireSetupResult = requireSetup()
			case "sendMessage":
				ping(append(
					append(
						[]byte{3},
						[]byte(request.Parameters.MessageDestination)...,
					),
					append(
						[]byte{0},
						[]byte(request.Parameters.Message)...,
					)...,
				))
			}

			response, err := json.Marshal(
				ResourceResponse{
					request.Name,
					ResponseContent{
						getInterfacesResult,
						getOSResult,
						getHostnameResult,
						requireSetupResult,
					},
				},
			)
			fmt.Println(string(response))
			if err != nil {
				log.Fatal("MARSHAL FAILED: ", err)
			}

			err = conn.WriteMessage(websocket.TextMessage, response)
			if err != nil {
				log.Fatal("WRITE FAILED: ", err)
				break
			}
		}

		writeSettings()
		settings.File.Close()
		server.Shutdown(context.Background())
	}
}
