/**
 * @fileoverview gRPC-Web generated client stub for api
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as backend_pb from './backend_pb';


export class BackendClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'binary';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoGetSelf = new grpcWeb.AbstractClientBase.MethodInfo(
    backend_pb.SelfReply,
    (request: backend_pb.SelfRequest) => {
      return request.serializeBinary();
    },
    backend_pb.SelfReply.deserializeBinary
  );

  getSelf(
    request: backend_pb.SelfRequest,
    metadata: grpcWeb.Metadata | null): Promise<backend_pb.SelfReply>;

  getSelf(
    request: backend_pb.SelfRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: backend_pb.SelfReply) => void): grpcWeb.ClientReadableStream<backend_pb.SelfReply>;

  getSelf(
    request: backend_pb.SelfRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: backend_pb.SelfReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.Backend/GetSelf',
        request,
        metadata || {},
        this.methodInfoGetSelf,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.Backend/GetSelf',
    request,
    metadata || {},
    this.methodInfoGetSelf);
  }

  methodInfoGetSetup = new grpcWeb.AbstractClientBase.MethodInfo(
    backend_pb.GetSetupResponse,
    (request: backend_pb.GetSetupRequest) => {
      return request.serializeBinary();
    },
    backend_pb.GetSetupResponse.deserializeBinary
  );

  getSetup(
    request: backend_pb.GetSetupRequest,
    metadata: grpcWeb.Metadata | null): Promise<backend_pb.GetSetupResponse>;

  getSetup(
    request: backend_pb.GetSetupRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: backend_pb.GetSetupResponse) => void): grpcWeb.ClientReadableStream<backend_pb.GetSetupResponse>;

  getSetup(
    request: backend_pb.GetSetupRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: backend_pb.GetSetupResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.Backend/GetSetup',
        request,
        metadata || {},
        this.methodInfoGetSetup,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.Backend/GetSetup',
    request,
    metadata || {},
    this.methodInfoGetSetup);
  }

  methodInfoSetSetup = new grpcWeb.AbstractClientBase.MethodInfo(
    backend_pb.SetSetupResponse,
    (request: backend_pb.SetSetupRequest) => {
      return request.serializeBinary();
    },
    backend_pb.SetSetupResponse.deserializeBinary
  );

  setSetup(
    request: backend_pb.SetSetupRequest,
    metadata: grpcWeb.Metadata | null): Promise<backend_pb.SetSetupResponse>;

  setSetup(
    request: backend_pb.SetSetupRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: backend_pb.SetSetupResponse) => void): grpcWeb.ClientReadableStream<backend_pb.SetSetupResponse>;

  setSetup(
    request: backend_pb.SetSetupRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: backend_pb.SetSetupResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.Backend/SetSetup',
        request,
        metadata || {},
        this.methodInfoSetSetup,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.Backend/SetSetup',
    request,
    metadata || {},
    this.methodInfoSetSetup);
  }

  methodInfoGetUsers = new grpcWeb.AbstractClientBase.MethodInfo(
    backend_pb.UsersReply,
    (request: backend_pb.UsersRequest) => {
      return request.serializeBinary();
    },
    backend_pb.UsersReply.deserializeBinary
  );

  getUsers(
    request: backend_pb.UsersRequest,
    metadata: grpcWeb.Metadata | null): Promise<backend_pb.UsersReply>;

  getUsers(
    request: backend_pb.UsersRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: backend_pb.UsersReply) => void): grpcWeb.ClientReadableStream<backend_pb.UsersReply>;

  getUsers(
    request: backend_pb.UsersRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: backend_pb.UsersReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.Backend/GetUsers',
        request,
        metadata || {},
        this.methodInfoGetUsers,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.Backend/GetUsers',
    request,
    metadata || {},
    this.methodInfoGetUsers);
  }

  methodInfoSendMessage = new grpcWeb.AbstractClientBase.MethodInfo(
    backend_pb.MessageResponse,
    (request: backend_pb.MessageRequest) => {
      return request.serializeBinary();
    },
    backend_pb.MessageResponse.deserializeBinary
  );

  sendMessage(
    request: backend_pb.MessageRequest,
    metadata: grpcWeb.Metadata | null): Promise<backend_pb.MessageResponse>;

  sendMessage(
    request: backend_pb.MessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: backend_pb.MessageResponse) => void): grpcWeb.ClientReadableStream<backend_pb.MessageResponse>;

  sendMessage(
    request: backend_pb.MessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: backend_pb.MessageResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.Backend/SendMessage',
        request,
        metadata || {},
        this.methodInfoSendMessage,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.Backend/SendMessage',
    request,
    metadata || {},
    this.methodInfoSendMessage);
  }

}

