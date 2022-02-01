// Code generated by protoc-gen-go-grpc. DO NOT EDIT.

package api

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// BackendClient is the client API for Backend service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type BackendClient interface {
	GetSelf(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*SelfResponse, error)
	GetSetup(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*GetSetupResponse, error)
	SetSetup(ctx context.Context, in *SetSetupRequest, opts ...grpc.CallOption) (*Empty, error)
	ListenUsers(ctx context.Context, in *Empty, opts ...grpc.CallOption) (Backend_ListenUsersClient, error)
	ListenMessages(ctx context.Context, in *Empty, opts ...grpc.CallOption) (Backend_ListenMessagesClient, error)
	ListenIncomingRequests(ctx context.Context, in *Empty, opts ...grpc.CallOption) (Backend_ListenIncomingRequestsClient, error)
	ListenIncomingStates(ctx context.Context, in *Empty, opts ...grpc.CallOption) (Backend_ListenIncomingStatesClient, error)
	TransferChoice(ctx context.Context, in *TransferChoiceRequest, opts ...grpc.CallOption) (*Empty, error)
	SendMessage(ctx context.Context, in *MessageRequest, opts ...grpc.CallOption) (*Empty, error)
	Quit(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*Empty, error)
}

type backendClient struct {
	cc grpc.ClientConnInterface
}

func NewBackendClient(cc grpc.ClientConnInterface) BackendClient {
	return &backendClient{cc}
}

func (c *backendClient) GetSelf(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*SelfResponse, error) {
	out := new(SelfResponse)
	err := c.cc.Invoke(ctx, "/api.Backend/GetSelf", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *backendClient) GetSetup(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*GetSetupResponse, error) {
	out := new(GetSetupResponse)
	err := c.cc.Invoke(ctx, "/api.Backend/GetSetup", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *backendClient) SetSetup(ctx context.Context, in *SetSetupRequest, opts ...grpc.CallOption) (*Empty, error) {
	out := new(Empty)
	err := c.cc.Invoke(ctx, "/api.Backend/SetSetup", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *backendClient) ListenUsers(ctx context.Context, in *Empty, opts ...grpc.CallOption) (Backend_ListenUsersClient, error) {
	stream, err := c.cc.NewStream(ctx, &Backend_ServiceDesc.Streams[0], "/api.Backend/ListenUsers", opts...)
	if err != nil {
		return nil, err
	}
	x := &backendListenUsersClient{stream}
	if err := x.ClientStream.SendMsg(in); err != nil {
		return nil, err
	}
	if err := x.ClientStream.CloseSend(); err != nil {
		return nil, err
	}
	return x, nil
}

type Backend_ListenUsersClient interface {
	Recv() (*UsersResponse, error)
	grpc.ClientStream
}

type backendListenUsersClient struct {
	grpc.ClientStream
}

func (x *backendListenUsersClient) Recv() (*UsersResponse, error) {
	m := new(UsersResponse)
	if err := x.ClientStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

func (c *backendClient) ListenMessages(ctx context.Context, in *Empty, opts ...grpc.CallOption) (Backend_ListenMessagesClient, error) {
	stream, err := c.cc.NewStream(ctx, &Backend_ServiceDesc.Streams[1], "/api.Backend/ListenMessages", opts...)
	if err != nil {
		return nil, err
	}
	x := &backendListenMessagesClient{stream}
	if err := x.ClientStream.SendMsg(in); err != nil {
		return nil, err
	}
	if err := x.ClientStream.CloseSend(); err != nil {
		return nil, err
	}
	return x, nil
}

type Backend_ListenMessagesClient interface {
	Recv() (*Message, error)
	grpc.ClientStream
}

type backendListenMessagesClient struct {
	grpc.ClientStream
}

func (x *backendListenMessagesClient) Recv() (*Message, error) {
	m := new(Message)
	if err := x.ClientStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

func (c *backendClient) ListenIncomingRequests(ctx context.Context, in *Empty, opts ...grpc.CallOption) (Backend_ListenIncomingRequestsClient, error) {
	stream, err := c.cc.NewStream(ctx, &Backend_ServiceDesc.Streams[2], "/api.Backend/ListenIncomingRequests", opts...)
	if err != nil {
		return nil, err
	}
	x := &backendListenIncomingRequestsClient{stream}
	if err := x.ClientStream.SendMsg(in); err != nil {
		return nil, err
	}
	if err := x.ClientStream.CloseSend(); err != nil {
		return nil, err
	}
	return x, nil
}

type Backend_ListenIncomingRequestsClient interface {
	Recv() (*TransferRequest, error)
	grpc.ClientStream
}

type backendListenIncomingRequestsClient struct {
	grpc.ClientStream
}

func (x *backendListenIncomingRequestsClient) Recv() (*TransferRequest, error) {
	m := new(TransferRequest)
	if err := x.ClientStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

func (c *backendClient) ListenIncomingStates(ctx context.Context, in *Empty, opts ...grpc.CallOption) (Backend_ListenIncomingStatesClient, error) {
	stream, err := c.cc.NewStream(ctx, &Backend_ServiceDesc.Streams[3], "/api.Backend/ListenIncomingStates", opts...)
	if err != nil {
		return nil, err
	}
	x := &backendListenIncomingStatesClient{stream}
	if err := x.ClientStream.SendMsg(in); err != nil {
		return nil, err
	}
	if err := x.ClientStream.CloseSend(); err != nil {
		return nil, err
	}
	return x, nil
}

type Backend_ListenIncomingStatesClient interface {
	Recv() (*TransferState, error)
	grpc.ClientStream
}

type backendListenIncomingStatesClient struct {
	grpc.ClientStream
}

func (x *backendListenIncomingStatesClient) Recv() (*TransferState, error) {
	m := new(TransferState)
	if err := x.ClientStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

func (c *backendClient) TransferChoice(ctx context.Context, in *TransferChoiceRequest, opts ...grpc.CallOption) (*Empty, error) {
	out := new(Empty)
	err := c.cc.Invoke(ctx, "/api.Backend/TransferChoice", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *backendClient) SendMessage(ctx context.Context, in *MessageRequest, opts ...grpc.CallOption) (*Empty, error) {
	out := new(Empty)
	err := c.cc.Invoke(ctx, "/api.Backend/SendMessage", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *backendClient) Quit(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*Empty, error) {
	out := new(Empty)
	err := c.cc.Invoke(ctx, "/api.Backend/Quit", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// BackendServer is the server API for Backend service.
// All implementations must embed UnimplementedBackendServer
// for forward compatibility
type BackendServer interface {
	GetSelf(context.Context, *Empty) (*SelfResponse, error)
	GetSetup(context.Context, *Empty) (*GetSetupResponse, error)
	SetSetup(context.Context, *SetSetupRequest) (*Empty, error)
	ListenUsers(*Empty, Backend_ListenUsersServer) error
	ListenMessages(*Empty, Backend_ListenMessagesServer) error
	ListenIncomingRequests(*Empty, Backend_ListenIncomingRequestsServer) error
	ListenIncomingStates(*Empty, Backend_ListenIncomingStatesServer) error
	TransferChoice(context.Context, *TransferChoiceRequest) (*Empty, error)
	SendMessage(context.Context, *MessageRequest) (*Empty, error)
	Quit(context.Context, *Empty) (*Empty, error)
	mustEmbedUnimplementedBackendServer()
}

// UnimplementedBackendServer must be embedded to have forward compatible implementations.
type UnimplementedBackendServer struct {
}

func (UnimplementedBackendServer) GetSelf(context.Context, *Empty) (*SelfResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetSelf not implemented")
}
func (UnimplementedBackendServer) GetSetup(context.Context, *Empty) (*GetSetupResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetSetup not implemented")
}
func (UnimplementedBackendServer) SetSetup(context.Context, *SetSetupRequest) (*Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SetSetup not implemented")
}
func (UnimplementedBackendServer) ListenUsers(*Empty, Backend_ListenUsersServer) error {
	return status.Errorf(codes.Unimplemented, "method ListenUsers not implemented")
}
func (UnimplementedBackendServer) ListenMessages(*Empty, Backend_ListenMessagesServer) error {
	return status.Errorf(codes.Unimplemented, "method ListenMessages not implemented")
}
func (UnimplementedBackendServer) ListenIncomingRequests(*Empty, Backend_ListenIncomingRequestsServer) error {
	return status.Errorf(codes.Unimplemented, "method ListenIncomingRequests not implemented")
}
func (UnimplementedBackendServer) ListenIncomingStates(*Empty, Backend_ListenIncomingStatesServer) error {
	return status.Errorf(codes.Unimplemented, "method ListenIncomingStates not implemented")
}
func (UnimplementedBackendServer) TransferChoice(context.Context, *TransferChoiceRequest) (*Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method TransferChoice not implemented")
}
func (UnimplementedBackendServer) SendMessage(context.Context, *MessageRequest) (*Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SendMessage not implemented")
}
func (UnimplementedBackendServer) Quit(context.Context, *Empty) (*Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Quit not implemented")
}
func (UnimplementedBackendServer) mustEmbedUnimplementedBackendServer() {}

// UnsafeBackendServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to BackendServer will
// result in compilation errors.
type UnsafeBackendServer interface {
	mustEmbedUnimplementedBackendServer()
}

func RegisterBackendServer(s grpc.ServiceRegistrar, srv BackendServer) {
	s.RegisterService(&Backend_ServiceDesc, srv)
}

func _Backend_GetSelf_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(BackendServer).GetSelf(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/api.Backend/GetSelf",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(BackendServer).GetSelf(ctx, req.(*Empty))
	}
	return interceptor(ctx, in, info, handler)
}

func _Backend_GetSetup_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(BackendServer).GetSetup(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/api.Backend/GetSetup",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(BackendServer).GetSetup(ctx, req.(*Empty))
	}
	return interceptor(ctx, in, info, handler)
}

func _Backend_SetSetup_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(SetSetupRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(BackendServer).SetSetup(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/api.Backend/SetSetup",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(BackendServer).SetSetup(ctx, req.(*SetSetupRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Backend_ListenUsers_Handler(srv interface{}, stream grpc.ServerStream) error {
	m := new(Empty)
	if err := stream.RecvMsg(m); err != nil {
		return err
	}
	return srv.(BackendServer).ListenUsers(m, &backendListenUsersServer{stream})
}

type Backend_ListenUsersServer interface {
	Send(*UsersResponse) error
	grpc.ServerStream
}

type backendListenUsersServer struct {
	grpc.ServerStream
}

func (x *backendListenUsersServer) Send(m *UsersResponse) error {
	return x.ServerStream.SendMsg(m)
}

func _Backend_ListenMessages_Handler(srv interface{}, stream grpc.ServerStream) error {
	m := new(Empty)
	if err := stream.RecvMsg(m); err != nil {
		return err
	}
	return srv.(BackendServer).ListenMessages(m, &backendListenMessagesServer{stream})
}

type Backend_ListenMessagesServer interface {
	Send(*Message) error
	grpc.ServerStream
}

type backendListenMessagesServer struct {
	grpc.ServerStream
}

func (x *backendListenMessagesServer) Send(m *Message) error {
	return x.ServerStream.SendMsg(m)
}

func _Backend_ListenIncomingRequests_Handler(srv interface{}, stream grpc.ServerStream) error {
	m := new(Empty)
	if err := stream.RecvMsg(m); err != nil {
		return err
	}
	return srv.(BackendServer).ListenIncomingRequests(m, &backendListenIncomingRequestsServer{stream})
}

type Backend_ListenIncomingRequestsServer interface {
	Send(*TransferRequest) error
	grpc.ServerStream
}

type backendListenIncomingRequestsServer struct {
	grpc.ServerStream
}

func (x *backendListenIncomingRequestsServer) Send(m *TransferRequest) error {
	return x.ServerStream.SendMsg(m)
}

func _Backend_ListenIncomingStates_Handler(srv interface{}, stream grpc.ServerStream) error {
	m := new(Empty)
	if err := stream.RecvMsg(m); err != nil {
		return err
	}
	return srv.(BackendServer).ListenIncomingStates(m, &backendListenIncomingStatesServer{stream})
}

type Backend_ListenIncomingStatesServer interface {
	Send(*TransferState) error
	grpc.ServerStream
}

type backendListenIncomingStatesServer struct {
	grpc.ServerStream
}

func (x *backendListenIncomingStatesServer) Send(m *TransferState) error {
	return x.ServerStream.SendMsg(m)
}

func _Backend_TransferChoice_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(TransferChoiceRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(BackendServer).TransferChoice(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/api.Backend/TransferChoice",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(BackendServer).TransferChoice(ctx, req.(*TransferChoiceRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Backend_SendMessage_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(MessageRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(BackendServer).SendMessage(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/api.Backend/SendMessage",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(BackendServer).SendMessage(ctx, req.(*MessageRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Backend_Quit_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(BackendServer).Quit(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/api.Backend/Quit",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(BackendServer).Quit(ctx, req.(*Empty))
	}
	return interceptor(ctx, in, info, handler)
}

// Backend_ServiceDesc is the grpc.ServiceDesc for Backend service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Backend_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "api.Backend",
	HandlerType: (*BackendServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetSelf",
			Handler:    _Backend_GetSelf_Handler,
		},
		{
			MethodName: "GetSetup",
			Handler:    _Backend_GetSetup_Handler,
		},
		{
			MethodName: "SetSetup",
			Handler:    _Backend_SetSetup_Handler,
		},
		{
			MethodName: "TransferChoice",
			Handler:    _Backend_TransferChoice_Handler,
		},
		{
			MethodName: "SendMessage",
			Handler:    _Backend_SendMessage_Handler,
		},
		{
			MethodName: "Quit",
			Handler:    _Backend_Quit_Handler,
		},
	},
	Streams: []grpc.StreamDesc{
		{
			StreamName:    "ListenUsers",
			Handler:       _Backend_ListenUsers_Handler,
			ServerStreams: true,
		},
		{
			StreamName:    "ListenMessages",
			Handler:       _Backend_ListenMessages_Handler,
			ServerStreams: true,
		},
		{
			StreamName:    "ListenIncomingRequests",
			Handler:       _Backend_ListenIncomingRequests_Handler,
			ServerStreams: true,
		},
		{
			StreamName:    "ListenIncomingStates",
			Handler:       _Backend_ListenIncomingStates_Handler,
			ServerStreams: true,
		},
	},
	Metadata: "backend.proto",
}
