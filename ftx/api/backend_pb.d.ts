import * as jspb from 'google-protobuf'



export class SelfRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SelfRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SelfRequest): SelfRequest.AsObject;
  static serializeBinaryToWriter(message: SelfRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SelfRequest;
  static deserializeBinaryFromReader(message: SelfRequest, reader: jspb.BinaryReader): SelfRequest;
}

export namespace SelfRequest {
  export type AsObject = {
  }
}

export class SelfReply extends jspb.Message {
  getHostname(): string;
  setHostname(value: string): SelfReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SelfReply.AsObject;
  static toObject(includeInstance: boolean, msg: SelfReply): SelfReply.AsObject;
  static serializeBinaryToWriter(message: SelfReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SelfReply;
  static deserializeBinaryFromReader(message: SelfReply, reader: jspb.BinaryReader): SelfReply;
}

export namespace SelfReply {
  export type AsObject = {
    hostname: string,
  }
}

export class GetSetupRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSetupRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetSetupRequest): GetSetupRequest.AsObject;
  static serializeBinaryToWriter(message: GetSetupRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSetupRequest;
  static deserializeBinaryFromReader(message: GetSetupRequest, reader: jspb.BinaryReader): GetSetupRequest;
}

export namespace GetSetupRequest {
  export type AsObject = {
  }
}

export class GetSetupResponse extends jspb.Message {
  getRequired(): boolean;
  setRequired(value: boolean): GetSetupResponse;

  getInterfacesList(): Array<NetworkInterface>;
  setInterfacesList(value: Array<NetworkInterface>): GetSetupResponse;
  clearInterfacesList(): GetSetupResponse;
  addInterfaces(value?: NetworkInterface, index?: number): NetworkInterface;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSetupResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetSetupResponse): GetSetupResponse.AsObject;
  static serializeBinaryToWriter(message: GetSetupResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSetupResponse;
  static deserializeBinaryFromReader(message: GetSetupResponse, reader: jspb.BinaryReader): GetSetupResponse;
}

export namespace GetSetupResponse {
  export type AsObject = {
    required: boolean,
    interfacesList: Array<NetworkInterface.AsObject>,
  }
}

export class SetSetupRequest extends jspb.Message {
  getInterface(): NetworkInterface | undefined;
  setInterface(value?: NetworkInterface): SetSetupRequest;
  hasInterface(): boolean;
  clearInterface(): SetSetupRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetSetupRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetSetupRequest): SetSetupRequest.AsObject;
  static serializeBinaryToWriter(message: SetSetupRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetSetupRequest;
  static deserializeBinaryFromReader(message: SetSetupRequest, reader: jspb.BinaryReader): SetSetupRequest;
}

export namespace SetSetupRequest {
  export type AsObject = {
    pb_interface?: NetworkInterface.AsObject,
  }
}

export class SetSetupResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetSetupResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetSetupResponse): SetSetupResponse.AsObject;
  static serializeBinaryToWriter(message: SetSetupResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetSetupResponse;
  static deserializeBinaryFromReader(message: SetSetupResponse, reader: jspb.BinaryReader): SetSetupResponse;
}

export namespace SetSetupResponse {
  export type AsObject = {
  }
}

export class MessageRequest extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): MessageRequest;

  getDestination(): string;
  setDestination(value: string): MessageRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MessageRequest): MessageRequest.AsObject;
  static serializeBinaryToWriter(message: MessageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageRequest;
  static deserializeBinaryFromReader(message: MessageRequest, reader: jspb.BinaryReader): MessageRequest;
}

export namespace MessageRequest {
  export type AsObject = {
    message: string,
    destination: string,
  }
}

export class MessageResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MessageResponse): MessageResponse.AsObject;
  static serializeBinaryToWriter(message: MessageResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageResponse;
  static deserializeBinaryFromReader(message: MessageResponse, reader: jspb.BinaryReader): MessageResponse;
}

export namespace MessageResponse {
  export type AsObject = {
  }
}

export class UsersRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UsersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UsersRequest): UsersRequest.AsObject;
  static serializeBinaryToWriter(message: UsersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UsersRequest;
  static deserializeBinaryFromReader(message: UsersRequest, reader: jspb.BinaryReader): UsersRequest;
}

export namespace UsersRequest {
  export type AsObject = {
  }
}

export class UsersReply extends jspb.Message {
  getUsersList(): Array<User>;
  setUsersList(value: Array<User>): UsersReply;
  clearUsersList(): UsersReply;
  addUsers(value?: User, index?: number): User;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UsersReply.AsObject;
  static toObject(includeInstance: boolean, msg: UsersReply): UsersReply.AsObject;
  static serializeBinaryToWriter(message: UsersReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UsersReply;
  static deserializeBinaryFromReader(message: UsersReply, reader: jspb.BinaryReader): UsersReply;
}

export namespace UsersReply {
  export type AsObject = {
    usersList: Array<User.AsObject>,
  }
}

export class NetworkInterface extends jspb.Message {
  getIndex(): number;
  setIndex(value: number): NetworkInterface;

  getAddress(): string;
  setAddress(value: string): NetworkInterface;

  getName(): string;
  setName(value: string): NetworkInterface;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NetworkInterface.AsObject;
  static toObject(includeInstance: boolean, msg: NetworkInterface): NetworkInterface.AsObject;
  static serializeBinaryToWriter(message: NetworkInterface, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NetworkInterface;
  static deserializeBinaryFromReader(message: NetworkInterface, reader: jspb.BinaryReader): NetworkInterface;
}

export namespace NetworkInterface {
  export type AsObject = {
    index: number,
    address: string,
    name: string,
  }
}

export class User extends jspb.Message {
  getIp(): string;
  setIp(value: string): User;

  getName(): string;
  setName(value: string): User;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): User.AsObject;
  static toObject(includeInstance: boolean, msg: User): User.AsObject;
  static serializeBinaryToWriter(message: User, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): User;
  static deserializeBinaryFromReader(message: User, reader: jspb.BinaryReader): User;
}

export namespace User {
  export type AsObject = {
    ip: string,
    name: string,
  }
}

