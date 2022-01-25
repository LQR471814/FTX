import { IP } from "lib/apptypes"

export type CommunicateContext = {
	peer: IP
	port: number
}

export type UploadContext = {
	peer: IP
	port: number
}

export type CascadingContext =
	| CommunicateContext
	| UploadContext
	| null
