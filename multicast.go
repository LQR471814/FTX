package main

import (
	"bytes"
	"context"
	"encoding/json"
	"log"
	"net"
	"strings"
	"time"

	"github.com/gorilla/websocket"
)

func ping(buf []byte) {
	group, err := net.ResolveUDPAddr("udp", multicastGroup)
	if err != nil {
		log.Fatal(err)
	}
	_, err = multicastConn.WriteToUDP(buf, group)
	if err != nil {
		log.Fatal(err)
	}
}

func keepAlive(ctx context.Context, grpAddr *net.UDPAddr) {
keepAliveLoop:
	for {
		select {
		case <-ctx.Done():
			break keepAliveLoop
		default:
			mainState.Mux.Lock()
			mainState.MulticastPeers = []*UserResponse{}
			mainState.Mux.Unlock()

			ping(append([]byte{0}, []byte(getHostname())...))
			time.Sleep(time.Second * 8)
		}
	}
}

func serveMulticastUDP(ctx context.Context, grpAddr *net.UDPAddr, mainState *State) {
serveLoop:
	for {
		select {
		case <-ctx.Done():
			break serveLoop
		default:
			buf := make([]byte, buffer)
			multicastConn.SetReadDeadline(time.Now().Add(1 * time.Second))

			_, src, err := multicastConn.ReadFromUDP(buf)
			if err != nil && !strings.Contains(err.Error(), "i/o timeout") {
				log.Fatal(err)
			}

			msgBytes := bytes.TrimRight(buf, "\x00")

			if len(msgBytes) != 0 { //? If the multicast received is not null or empty
				messageType := msgBytes[0]
				switch messageType {
				case 0: //? On Add User
					userName := string(msgBytes[1:])
					for _, user := range mainState.MulticastPeers {
						if user.Name == userName && user.IP == src.String() {
							continue serveLoop
						}
					}

					log.Default().Println(string(msgBytes), src)

					ping(append([]byte{0}, []byte(getHostname())...))

					mainState.Mux.Lock()
					mainState.MulticastPeers = append(mainState.MulticastPeers, &UserResponse{"addUser", userName, src.String()})
					mainState.Mux.Unlock()

					res, err := json.Marshal(UserResponse{"addUser", userName, src.String()})
					if err != nil {
						log.Fatal("JSON MARSHAL FAILED: ", err)
						return
					}

					for _, websocketConn := range updateUserConns {
						websocketConn.WriteMessage(websocket.TextMessage, res)
					}
				case 1:
					ping(append([]byte{0}, []byte(getHostname())...))
				case 2: //? On Remove User
					userName := string(msgBytes[1:])

					for i, user := range mainState.MulticastPeers {
						if user.IP == src.String() && user.Name == userName {
							mainState.Mux.Lock()
							mainState.MulticastPeers = append(mainState.MulticastPeers[:i], mainState.MulticastPeers[i+1:]...)
							mainState.Mux.Unlock()

							res, err := json.Marshal(UserResponse{"removeUser", userName, src.String()})
							if err != nil {
								log.Fatal("JSON MARSHAL FAILED: ", err)
								return
							}
							for _, websocketConn := range updateUserConns {
								websocketConn.WriteMessage(websocket.TextMessage, res)
							}
							break
						}
					}
				case 3: //? On Receive Message
					messageParams := bytes.Split(msgBytes[1:], []byte{0})
					destination := string(messageParams[0])

					if destination == getHostname() {
						from := src.String()
						message := string(messageParams[1])

						res, err := json.Marshal(MessageResponse{from, message})
						if err != nil {
							log.Fatal("JSON MARSHAL FAILED: ", err)
							return
						}

						for _, websocketConn := range recvMessageConns {
							websocketConn.WriteMessage(websocket.TextMessage, res)
						}
					}
				}
			}
		}
	}
}
