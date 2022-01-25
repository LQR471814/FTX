export enum Event {
	start,
	open,
	startFileUpload,
	exitFileUpload,
	uploadComplete,
}

export enum State {
	INITIAL,
	CONNECTING,
	WAITING_TO_START,
	WAITING_FOR_COMPLETION,
}

export enum Action {
	OpenWSConn,
	SendFileReq,
	UploadFile,
	IncrementFileInd,
	Quit,
}

type StateMatrix = {
	[key in Event]: {
		[key in State]?: {
			actions: Action[]
			newState: State
		}
	}
}

export const EventStateMatrix: StateMatrix = {
	[Event.start]: { [State.INITIAL]: {
		actions: [Action.OpenWSConn],
		newState: State.CONNECTING,
	}},
	[Event.open]: { [State.CONNECTING]: {
		actions: [Action.SendFileReq],
		newState: State.WAITING_TO_START,
	}},
	[Event.startFileUpload]: { [State.WAITING_TO_START]: {
		actions: [Action.UploadFile],
		newState: State.WAITING_FOR_COMPLETION,
	}},
	[Event.exitFileUpload]: {
		[State.WAITING_TO_START]: {
			actions: [Action.Quit],
			newState: State.INITIAL,
		},
		[State.WAITING_FOR_COMPLETION]: {
			actions: [Action.Quit],
			newState: State.INITIAL,
		}
	},
	[Event.uploadComplete]: { [State.WAITING_FOR_COMPLETION]: {
		actions: [Action.IncrementFileInd],
		newState: State.WAITING_TO_START,
	}},
}
