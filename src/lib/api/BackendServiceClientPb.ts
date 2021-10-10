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
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoGetSelf = new grpcWeb.AbstractClientBase.MethodInfo(
    backend_pb.SelfResponse,
    (request: backend_pb.Empty) => {
      return request.serializeBinary();
    },
    backend_pb.SelfResponse.deserializeBinary
  );

  getSelf(
    request: backend_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<backend_pb.SelfResponse>;

  getSelf(
    request: backend_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: backend_pb.SelfResponse) => void): grpcWeb.ClientReadableStream<backend_pb.SelfResponse>;

  getSelf(
    request: backend_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: backend_pb.SelfResponse) => void) {
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
    (request: backend_pb.Empty) => {
      return request.serializeBinary();
    },
    backend_pb.GetSetupResponse.deserializeBinary
  );

  getSetup(
    request: backend_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<backend_pb.GetSetupResponse>;

  getSetup(
    request: backend_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: backend_pb.GetSetupResponse) => void): grpcWeb.ClientReadableStream<backend_pb.GetSetupResponse>;

  getSetup(
    request: backend_pb.Empty,
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
    backend_pb.Empty,
    (request: backend_pb.SetSetupRequest) => {
      return request.serializeBinary();
    },
    backend_pb.Empty.deserializeBinary
  );

  setSetup(
    request: backend_pb.SetSetupRequest,
    metadata: grpcWeb.Metadata | null): Promise<backend_pb.Empty>;

  setSetup(
    request: backend_pb.SetSetupRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: backend_pb.Empty) => void): grpcWeb.ClientReadableStream<backend_pb.Empty>;

  setSetup(
    request: backend_pb.SetSetupRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: backend_pb.Empty) => void) {
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

  methodInfoListenUsers = new grpcWeb.AbstractClientBase.MethodInfo(
    backend_pb.UsersResponse,
    (request: backend_pb.Empty) => {
      return request.serializeBinary();
    },
    backend_pb.UsersResponse.deserializeBinary
  );

  listenUsers(
    request: backend_pb.Empty,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/api.Backend/ListenUsers',
      request,
      metadata || {},
      this.methodInfoListenUsers);
  }

  methodInfoListenMessages = new grpcWeb.AbstractClientBase.MethodInfo(
    backend_pb.Message,
    (request: backend_pb.Empty) => {
      return request.serializeBinary();
    },
    backend_pb.Message.deserializeBinary
  );

  listenMessages(
    request: backend_pb.Empty,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/api.Backend/ListenMessages',
      request,
      metadata || {},
      this.methodInfoListenMessages);
  }

  methodInfoListenTransferRequests = new grpcWeb.AbstractClientBase.MethodInfo(
    backend_pb.TransferRequest,
    (request: backend_pb.Empty) => {
      return request.serializeBinary();
    },
    backend_pb.TransferRequest.deserializeBinary
  );

  listenTransferRequests(
    request: backend_pb.Empty,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/api.Backend/ListenTransferRequests',
      request,
      metadata || {},
      this.methodInfoListenTransferRequests);
  }

  methodInfoListenTransferStates = new grpcWeb.AbstractClientBase.MethodInfo(
    backend_pb.TransferState,
    (request: backend_pb.Empty) => {
      return request.serializeBinary();
    },
    backend_pb.TransferState.deserializeBinary
  );

  listenTransferStates(
    request: backend_pb.Empty,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/api.Backend/ListenTransferStates',
      request,
      metadata || {},
      this.methodInfoListenTransferStates);
  }

  methodInfoTransferChoice = new grpcWeb.AbstractClientBase.MethodInfo(
    backend_pb.Empty,
    (request: backend_pb.TransferChoiceRequest) => {
      return request.serializeBinary();
    },
    backend_pb.Empty.deserializeBinary
  );

  transferChoice(
    request: backend_pb.TransferChoiceRequest,
    metadata: grpcWeb.Metadata | null): Promise<backend_pb.Empty>;

  transferChoice(
    request: backend_pb.TransferChoiceRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: backend_pb.Empty) => void): grpcWeb.ClientReadableStream<backend_pb.Empty>;

  transferChoice(
    request: backend_pb.TransferChoiceRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: backend_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.Backend/TransferChoice',
        request,
        metadata || {},
        this.methodInfoTransferChoice,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.Backend/TransferChoice',
    request,
    metadata || {},
    this.methodInfoTransferChoice);
  }

  methodInfoSendMessage = new grpcWeb.AbstractClientBase.MethodInfo(
    backend_pb.Empty,
    (request: backend_pb.MessageRequest) => {
      return request.serializeBinary();
    },
    backend_pb.Empty.deserializeBinary
  );

  sendMessage(
    request: backend_pb.MessageRequest,
    metadata: grpcWeb.Metadata | null): Promise<backend_pb.Empty>;

  sendMessage(
    request: backend_pb.MessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: backend_pb.Empty) => void): grpcWeb.ClientReadableStream<backend_pb.Empty>;

  sendMessage(
    request: backend_pb.MessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: backend_pb.Empty) => void) {
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

  methodInfoQuit = new grpcWeb.AbstractClientBase.MethodInfo(
    backend_pb.Empty,
    (request: backend_pb.Empty) => {
      return request.serializeBinary();
    },
    backend_pb.Empty.deserializeBinary
  );

  quit(
    request: backend_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<backend_pb.Empty>;

  quit(
    request: backend_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: backend_pb.Empty) => void): grpcWeb.ClientReadableStream<backend_pb.Empty>;

  quit(
    request: backend_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: backend_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/api.Backend/Quit',
        request,
        metadata || {},
        this.methodInfoQuit,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/api.Backend/Quit',
    request,
    metadata || {},
    this.methodInfoQuit);
  }

}

