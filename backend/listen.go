package main

import (
	"bytes"
	"ftx/backend/api"
	"ftx/backend/peers"
	"ftx/backend/state"
	"log"

	"github.com/LQR471814/multicast"
	"github.com/LQR471814/multicast/operations"
)

func updateMessageChannels(s *state.State, msg *api.Message) {
	for _, messageUpdateChannel := range *s.MessageUpdateChannels {
		messageUpdateChannel.Send(msg)
	}
}

func updatePeerChannels(s *state.State) {
	peers := []*api.User{}
	for _, p := range s.Peers {
		peers = append(peers, &api.User{
			Name: p.Name,
			IP:   p.Addr.String(),
		})
	}

	for _, peerUpdateChannel := range *s.PeerUpdateChannels {
		peerUpdateChannel.Send(&api.UsersResponse{
			Users: peers,
		})
	}
}

func PeerListen(s *state.State) {
	multicast.Listen(s.Group, func(packet operations.MulticastPacket) {
		packetType := packet.Contents[0]
		content := packet.Contents[1:]

		fromStr := packet.Src.String()
		log.Println("From", fromStr, "of type", packetType, "with content", content)

		switch packetType {
		case peers.USER_REGISTRATION_FLAG:
			if s.Peers[fromStr] != (state.Peer{}) {
				break
			}

			name := string(content)
			s.Peers[fromStr] = state.Peer{
				Name: name,
				Addr: packet.Src,
			}

			updatePeerChannels(s)
			peers.Register(s.Group, s.Name)
		case peers.USER_MESSAGE_FLAG:
			payloadFragments := bytes.Split(content, []byte{0}) //? Split by null byte

			destination := string(payloadFragments[0])
			message := string(payloadFragments[1])

			author := s.Peers[fromStr]

			destAddr, err := StringToUDPAddr(destination)
			if err != nil {
				panic(err)
			}

			addrApplies, err := AddrInInterface(s.Settings.Interface, destAddr)
			if err != nil {
				panic(err)
			}

			if addrApplies {
				updateMessageChannels(s, &api.Message{
					Author: &api.User{
						Name: author.Name,
						IP:   fromStr,
					},
					Contents: message,
				})
			}
		case peers.USER_QUIT_FLAG:
			delete(s.Peers, packet.Src.String())

			updatePeerChannels(s)
		}
	})
}
