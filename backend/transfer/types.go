package transfer

import (
	"ftx/backend/api"
	"net"

	"github.com/gorilla/websocket"
)

type Signal struct {
	Type string
}

type FileRequests struct {
	Type  string
	Files []File
}

type File struct {
	Name string
	Size int
	Type string
}

func (f File) ToProto() *api.File {
	return &api.File{
		Name: f.Name,
		Size: int64(f.Size),
		Type: f.Type,
	}
}

type Transfer struct {
	From        net.Addr
	State       State
	Files       []File
	CurrentFile int
	Received    int
	ID          string

	dataChan chan []byte
	conn     *websocket.Conn
}

func (t *Transfer) ToState() *api.TransferState {
	return &api.TransferState{
		Id:          t.ID,
		Currentfile: int32(t.CurrentFile),
		Progress:    float32(t.Received) / float32(t.Files[t.CurrentFile].Size),
	}
}

func (t *Transfer) ToRequest() *api.TransferRequest {
	files := []*api.File{}
	for _, f := range t.Files {
		files = append(files, f.ToProto())
	}

	return &api.TransferRequest{
		From:  t.From.String(),
		Id:    t.ID,
		Files: files,
	}
}

//? Note: WriteChunk / recvfilecontents is not present here
//?  because it would make things unnecessarily complex and inefficient

//?  The logic is still implemented, it's just not through the handlers

type State int

const (
	INITIAL State = iota
	LISTENING_FOR_FILE_REQUESTS
	WAITING_FOR_USER_CONFIRMATION
	RECEIVING
)

type Event int

const (
	peerConnect Event = iota
	recvRequests
	userAccept
	userDeny
	recvDone
)

type Action int

const (
	DisplayFileRequests Action = iota
	IncrementFileIndex
	SendClientAllow

	SendStartSignal
	SendExitSignal
	SendFinishedSignal

	StartFileWriter
	StopFileWriter

	RecvDoneHandler
)

type StateMatrix map[Event]map[State]struct {
	Actions  []Action
	NewState State
}

var EventStateMatrix = StateMatrix{
	peerConnect: {
		INITIAL: {
			Actions:  []Action{},
			NewState: LISTENING_FOR_FILE_REQUESTS,
		},
	},
	recvRequests: {
		LISTENING_FOR_FILE_REQUESTS: {
			Actions:  []Action{DisplayFileRequests},
			NewState: WAITING_FOR_USER_CONFIRMATION,
		},
	},
	userAccept: {
		WAITING_FOR_USER_CONFIRMATION: {
			Actions:  []Action{SendStartSignal, StartFileWriter},
			NewState: RECEIVING,
		},
	},
	userDeny: {
		WAITING_FOR_USER_CONFIRMATION: {
			Actions:  []Action{SendExitSignal},
			NewState: INITIAL,
		},
	},
	recvDone: {
		RECEIVING: {
			Actions:  []Action{StopFileWriter, SendFinishedSignal, IncrementFileIndex, RecvDoneHandler},
			NewState: RECEIVING,
		},
	},
}
