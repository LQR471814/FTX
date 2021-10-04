type CommunicateContext = {
	id: IP
	port: number
}

type UploadContext = {
	id: IP
	port: number
}

type CascadingContext =
	| CommunicateContext
	| UploadContext
	| null
