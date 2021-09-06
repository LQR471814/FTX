package ftx

import (
	"ftx/common"
	"ftx/peers"
	"ftx/state"

	"github.com/LQR471814/multicast"
	"github.com/LQR471814/multicast/operations"
)

func PeerListen(state *state.State) {
	multicast.Listen(state.Group, func(packet operations.MulticastPacket) {
		packetType := packet.Contents[0]
		content := packet.Contents[1:]

		switch packetType {
		case peers.USER_REGISTRATION_FLAG:
			name := string(content)
			state.Peers[packet.Src.String()] = common.Peer{
				Name: name,
				IP:   packet.Src.String(),
			}
		case peers.USER_QUIT_FLAG:
			delete(state.Peers, packet.Src.String())
		}
	})
}
