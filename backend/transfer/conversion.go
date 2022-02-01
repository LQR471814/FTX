package transfer

import (
	"ftx/backend/api"
	"strconv"

	wsftp "github.com/LQR471814/websocket-ftp/server"
)

func ToState(t *wsftp.Transfer) *api.TransferState {
	return &api.TransferState{
		Id:          strconv.FormatUint(t.ID, 10),
		Currentfile: int32(t.State.CurrentFile),
		Progress: float32(
			float64(t.State.Received) /
				float64(t.Data.Files[t.State.CurrentFile].Size),
		),
	}
}

func ToRequest(t *wsftp.Transfer) *api.TransferRequest {
	files := []*api.File{}
	for _, f := range t.Data.Files {
		files = append(files, ToFile(f))
	}

	return &api.TransferRequest{
		From:  t.Data.From.String(),
		Id:    strconv.FormatUint(t.ID, 10),
		Files: files,
	}
}

func ToFile(t wsftp.File) *api.File {
	return &api.File{
		Name: t.Name,
		Size: t.Size,
		Type: t.Type,
	}
}
