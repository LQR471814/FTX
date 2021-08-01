type CommunicateContext = {
	id: IP
}

type UploadContext = {
	id: IP
}

type CascadingContext =
	| CommunicateContext
	| UploadContext
	| null
