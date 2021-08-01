class BackendInterface {
	path: string
	ws: WebSocket

	dev?: boolean

	constructor(path: string, dev?: boolean) {
		this.path = path
		this.ws = new WebSocket(path)

		this.dev = dev
	}
}

export class BackendChannel extends BackendInterface {
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

export class BackendApiWS extends BackendInterface {
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
