package peers

const (
	MULTICAST_GROUP        = "224.0.0.1:5001"
	USER_REGISTRATION_FLAG = 0
	KEEP_ALIVE_FLAG        = 1
	USER_QUIT_FLAG         = 2
	USER_MESSAGE_FLAG      = 3
)

type Peer struct {
	Name string
	IP   string
}
