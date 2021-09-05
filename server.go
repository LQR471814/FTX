package ftx

import (
	"context"
	"net/http"
	"os"
	"os/exec"
	"strconv"

	"ftx/api"

	"github.com/LQR471814/multicast"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"google.golang.org/grpc"
)

type BackendServer struct {
	api.UnimplementedBackendServer
}

func (*BackendServer) GetSelf(ctx context.Context, req *api.SelfRequest) (*api.SelfReply, error) {
	host, err := getHostname()

	return &api.SelfReply{
		Hostname: host,
	}, err
}

func (*BackendServer) GetSetup(ctx context.Context, req *api.GetSetupRequest) (*api.GetSetupResponse, error) {
	setupRequired, err := multicast.Check()
	if err != nil {
		return nil, err
	}

	interfaces, err := GetInterfaces()
	if err != nil {
		return nil, err
	}

	return &api.GetSetupResponse{
		Required:   !setupRequired,
		Interfaces: interfaces,
	}, nil
}

func (*BackendServer) SetSetup(ctx context.Context, req *api.SetSetupRequest) (*api.SetSetupResponse, error) {
	execpath, err := os.Executable()
	if err != nil {
		return nil, err
	}

	err = exec.Command(
		"multicast-utility.exe",
		"-Interface", strconv.Itoa(int(req.Interface.Index)),
		"-Path", execpath,
	).Run()

	if err != nil {
		return nil, err
	}

	return nil, nil
}

func InitializeGRPC(serve string) {
	gRPCServer := grpc.NewServer()
	api.RegisterBackendServer(gRPCServer, &BackendServer{})

	wrappedServer := grpcweb.WrapServer(gRPCServer)

	handler := func(resp http.ResponseWriter, req *http.Request) {
		wrappedServer.ServeHTTP(resp, req)
	}

	server := http.Server{
		Addr:    serve,
		Handler: http.HandlerFunc(handler),
	}

	server.ListenAndServe()
}
