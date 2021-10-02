import * as jspb from 'google-protobuf'



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

export class Message extends jspb.Message {
  getAuthor(): User | undefined;
  setAuthor(value?: User): Message;
  hasAuthor(): boolean;
  clearAuthor(): Message;

  getContents(): string;
  setContents(value: string): Message;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Message.AsObject;
  static toObject(includeInstance: boolean, msg: Message): Message.AsObject;
  static serializeBinaryToWriter(message: Message, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Message;
  static deserializeBinaryFromReader(message: Message, reader: jspb.BinaryReader): Message;
}

export namespace Message {
  export type AsObject = {
    author?: User.AsObject,
    contents: string,
  }
}

export class Empty extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Empty.AsObject;
  static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject;
  static serializeBinaryToWriter(message: Empty, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Empty;
  static deserializeBinaryFromReader(message: Empty, reader: jspb.BinaryReader): Empty;
}

export namespace Empty {
  export type AsObject = {
  }
}

export class SelfResponse extends jspb.Message {
  getHostname(): string;
  setHostname(value: string): SelfResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SelfResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SelfResponse): SelfResponse.AsObject;
  static serializeBinaryToWriter(message: SelfResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SelfResponse;
  static deserializeBinaryFromReader(message: SelfResponse, reader: jspb.BinaryReader): SelfResponse;
}

export namespace SelfResponse {
  export type AsObject = {
    hostname: string,
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

export class MessageRequest extends jspb.Message {
  getTo(): User | undefined;
  setTo(value?: User): MessageRequest;
  hasTo(): boolean;
  clearTo(): MessageRequest;

  getMessage(): Message | undefined;
  setMessage(value?: Message): MessageRequest;
  hasMessage(): boolean;
  clearMessage(): MessageRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MessageRequest): MessageRequest.AsObject;
  static serializeBinaryToWriter(message: MessageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageRequest;
  static deserializeBinaryFromReader(message: MessageRequest, reader: jspb.BinaryReader): MessageRequest;
}

export namespace MessageRequest {
  export type AsObject = {
    to?: User.AsObject,
    message?: Message.AsObject,
  }
}

export class UsersResponse extends jspb.Message {
  getUsersList(): Array<User>;
  setUsersList(value: Array<User>): UsersResponse;
  clearUsersList(): UsersResponse;
  addUsers(value?: User, index?: number): User;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UsersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UsersResponse): UsersResponse.AsObject;
  static serializeBinaryToWriter(message: UsersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UsersResponse;
  static deserializeBinaryFromReader(message: UsersResponse, reader: jspb.BinaryReader): UsersResponse;
}

export namespace UsersResponse {
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

