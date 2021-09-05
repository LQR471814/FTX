package ftx

import (
	"context"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"

	"ftx/api"
	"ftx/peers"
	"ftx/state"

	"github.com/LQR471814/multicast"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"google.golang.org/grpc"
)

type BackendServer struct {
	api.UnimplementedBackendServer
}

func (*BackendServer) GetSelf(ctx context.Context, req *api.SelfRequest) (*api.SelfReply, error) {
	host, err := os.Hostname()

	return &api.SelfReply{
		Hostname: host,
	}, err
}

func (*BackendServer) GetSetup(ctx context.Context, req *api.GetSetupRequest) (*api.GetSetupResponse, error) {
	multicastWorks, err := multicast.Check()
	if err != nil {
		return nil, err
	}

	interfaces, err := GetInterfaces()
	if err != nil {
		return nil, err
	}

	return &api.GetSetupResponse{
		Required: !multicastWorks ||
			(*state.Current()).Settings.Interface < 0,
		Interfaces: interfaces,
	}, nil
}

func (*BackendServer) SetSetup(ctx context.Context, req *api.SetSetupRequest) (*api.SetSetupResponse, error) {
	execpath, err := os.Executable()
	if err != nil {
		return nil, err
	}

	utilitypath := filepath.Join(
		filepath.Dir(execpath),
		"multicast-utility.exe",
	)

	err = exec.Command(
		utilitypath,
		"-Interface", strconv.Itoa(int(req.Interface.Index)),
		"-Path", execpath,
	).Run()

	if err != nil {
		return nil, err
	}

	return nil, nil
}

func (*BackendServer) GetUsers(ctx context.Context, req *api.UsersRequest) (*api.UsersReply, error) {
	result := []*api.User{}
	for _, peer := range state.Current().Peers {
		result = append(result, &api.User{
			IP:   peer.IP,
			Name: peer.Name,
		})
	}

	return &api.UsersReply{
		Users: result,
	}, nil
}

func (*BackendServer) SendMessage(ctx context.Context, req *api.MessageRequest) (*api.MessageResponse, error) {
	peers.Message(req.Destination, req.Message)
	return nil, nil
}

func ServeGRPC(listener net.Listener) {
	gRPCServer := grpc.NewServer()
	api.RegisterBackendServer(gRPCServer, &BackendServer{})

	wrappedServer := grpcweb.WrapServer(gRPCServer)

	handler := func(resp http.ResponseWriter, req *http.Request) {
		wrappedServer.ServeHTTP(resp, req)
	}

	server := http.Server{
		Handler: http.HandlerFunc(handler),
	}

	server.Serve(listener)
}
