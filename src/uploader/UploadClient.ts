import { Context, WorkerBound, ClientBound, ManagerBound } from "./UploadTypes"
import { EventStateMatrix, State, Event, Action } from "./UploadState"

const store: {
	conn: WebSocket | null
	context: Context | null
	state: State
	currentFile: number
} = {
	conn: null,
	context: null,
	state: State.INITIAL,
	currentFile: 0,
}

const CHUNK_SIZE = 1024 ** 2

onmessage = (message) => {
	const handler = (msg: WorkerBound) => { //? Weird TS hack to be able to access context
		switch (msg.type) {
			case "start":
				store.context = msg.context
				eventReducer(Event.start)
				break
			case "cancel":
				eventReducer(Event.exitFileUpload)
				break
		}
	}

	handler(message.data as WorkerBound)
}

const connHandler = (message: MessageEvent) => {
	const handler = (msg: ClientBound) => {
		switch (msg.Type) {
			case "start":
				eventReducer(Event.startFileUpload)
				break
			case "exit":
				eventReducer(Event.exitFileUpload)
				break
			case "complete":
				eventReducer(Event.uploadComplete)
				break
		}
	}

	handler(JSON.parse(message.data) as ClientBound)
}

function eventReducer(event: Event) {
	const cell = EventStateMatrix[event][store.state]
	if (!cell) {
		console.error("Cell doesn't exist under these circumstances", event, store.state)
		return
	}
	console.log(event, store.state)

	for (const action of cell.actions)
		actionReducer(action)

	store.state = cell.newState
}

function actionReducer(action: Action) {
	if (!store.context) {
		console.error("Connection or context hasn't been initialized")
		return
	}

	switch (action) {
		case Action.OpenWSConn:
			store.conn = new WebSocket(store.context.server)
			store.conn.onopen = () => {
				eventReducer(Event.open)
			}
			store.conn.onmessage = connHandler

			break
		case Action.SendFileReq:
			if (!store.conn) {
				console.error("Connection hasn't been initialized")
				return
			}

			store.conn.send(JSON.stringify({
				Type: "files",
				Files: store.context.files.map(f => {
					return {
						Name: f.name,
						Size: f.size,
						Type: f.type,
					}
				})
			}))
			break
		case Action.UploadFile:
			if (!store.conn) {
				console.error("Connection hasn't been initialized")
				return
			}

			const f = store.context.files[store.currentFile]
			const statusUpdateOffset = f.size / 15 //? Value is based on amount of places in the progress bar where upload status will be sent

			let bytesRemaining = f.size
			let byteStart = 0
			let updatePosition = statusUpdateOffset

			while (bytesRemaining > 0) {
				store.conn.send(f.slice(byteStart, byteStart + CHUNK_SIZE))

				bytesRemaining -= CHUNK_SIZE
				byteStart += CHUNK_SIZE

				if (byteStart > updatePosition) { // Only send file if current sent bytes is larger than update frequency
					postMessage({
						type: "state",
						state: {
							status: "Uploading File...",
							progress: (f.size > byteStart ? byteStart : f.size) / f.size //? To avoid weird 200% progress things
						}
					} as ManagerBound)
					updatePosition += statusUpdateOffset
				}
			}
			break
		case Action.IncrementFileInd:
			store.currentFile += 1
			if (!store.context.files[store.currentFile]) {
				eventReducer(Event.exitFileUpload)
				return
			}

			eventReducer(Event.startFileUpload)
			break
		case Action.Quit:
			store.conn?.close()
			postMessage({
				type: "done"
			} as ManagerBound)
			break
		default:
			console.error(action, "does not exist!")
			break
	}
}

export { }
