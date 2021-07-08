class BackendInterface {
	path: string
	ws: WebSocket

	dev?: boolean

	constructor(path: string, dev?: boolean) {
		this.path = path
		this.ws = new WebSocket(base + path)

		this.dev = dev
	}
}

class BackendChannel extends BackendInterface {
	listen(callback: (msg: any) => void) {
		if (this.dev) {
			console.log('Attached listener to', this.path, callback)
			return
		}

		this.ws.addEventListener('message', (e) => {
			const msg = JSON.parse(e.data)
			callback(msg)
		})
	}
}

class BackendApiWS extends BackendInterface {
	validRequests: string[]

	constructor(path: string, validRequests: string[], dev?: boolean) {
		super(path, dev)

		this.validRequests = validRequests
	}

	request(requestName: string, parameters: any) {
		if (this.dev) {
			console.log(
				'Requested',
				requestName,
				'with parameters',
				parameters,
				'on',
				this.path
			)
			return
		}

		if (!this.validRequests.includes(requestName)) {
			console.error(`${requestName} is not a valid request to send to this api`)
			return
		}

		this.ws.send(JSON.stringify(
			{ name: requestName, parameters: parameters }
		))

		return new Promise(resolve => {
			this.ws.addEventListener('message', (e) => {
				const msg = JSON.parse(e.data)

				if (msg.MsgType === requestName) {
					resolve(msg)
				}
			}, { once: true })
		})
	}
}

export const REQ_HOSTNAME = 'getHostname'
export const REQ_INTERFACES = 'getInterfaces'
export const REQ_SET_INTERFACES = 'setInterfaces'
export const REQ_SETUP_REQUIREMENT = 'requireSetup'
export const REQ_SEND_MESSAGE = 'sendMessage'

const base = 'ws://localhost:3000'

const userListUpdaterPath = '/updateUsers'
const resourceSocketPath = '/resource'
const recvMessageSocketPath = '/recvMessage'

export let resourceSocket: BackendApiWS
export let userListUpdater: BackendChannel
export let recvMessage: BackendChannel

const dev = true

export function initialize() {
	resourceSocket = new BackendApiWS(resourceSocketPath, [
		REQ_HOSTNAME,
		REQ_INTERFACES,
		REQ_SETUP_REQUIREMENT,
		REQ_SEND_MESSAGE
	], dev)

	userListUpdater = new BackendChannel(userListUpdaterPath, dev)
	recvMessage = new BackendChannel(recvMessageSocketPath, dev)
}
