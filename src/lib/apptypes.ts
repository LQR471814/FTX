import {
	NetworkInterface as ProtoInterface,
	User as ProtoUser,
	Message as ProtoMessage,
	TransferRequest as ProtoTransferRequest,
	TransferState as ProtoTransferState,
	File as ProtoFile,
} from "./api/backend_pb"
import { CascadingContext } from "./CascadingContext"

//? Frontend Types

export type IP = string
export type Primitive = string | number | bigint | boolean | symbol

export type OverlayType = "networkInterfaces" | "commChoice" | "uploadRegion"
export type OverlayState = {
	shown: boolean
	context: CascadingContext | null
}

export type BannerStyle = {
	text: string
	buttonText: string
	backgroundColor: string
	textColor: string
}

export type MessageGroup = {
	user: string
	messages: Message[]
	displayed: boolean
}

export type Transfer = {
	worker: Worker | null
	peer: string
	outgoing: boolean
	state: TransferState
}

//? Immutable type replacements to gRPC message classes

export function protoToUser(user: ProtoUser): User {
	return {
		name: user.getName(),
		ip: user.getIp(),
		fileport: user.getFileport(),
	}
}

export type User = {
	name: string
	ip: IP
	fileport: number
}

export function protoToInterface(intf: ProtoInterface): Interface {
	return {
		name: intf.getName(),
		address: intf.getAddress(),
		index: intf.getIndex(),
	}
}

export type Interface = {
	name: string
	address: IP
	index: number
}

export function protoToMessage(msg: ProtoMessage): Message | null {
	const author = msg.getAuthor()
	if (!author) return null

	return {
		author: author,
		content: msg.getContents(),
	}
}

export type Message = {
	content: string
	author: string
}

export function protoToFile(f: ProtoFile): File {
	return {
		name: f.getName(),
		size: f.getSize(),
		type: f.getType(),
	}
}

export type File = {
	name: string,
	size: number,
	type: string,
}

export function protoToTransferRequest(req: ProtoTransferRequest): TransferRequest | null {
	const files = []
	for (const f of req.getFilesList()) {
		files.push(protoToFile(f))
	}

	return {
		from: req.getFrom(),
		files: files
	}
}

export type TransferRequest = {
	from: string
	files: File[]
}

export function protoToTransferState(state: ProtoTransferState): TransferState {
	return {
		status: "Receiving file...",
		progress: state.getProgress(),
	}
}

export type TransferState = {
	status: string
	//? A number from 0 - 100 (If NaN, it will hide ProgressBar)
	progress: number
}
