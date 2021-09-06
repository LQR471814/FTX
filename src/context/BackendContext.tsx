import cookie from 'cookie'
import { BackendClient } from 'lib/BackendServiceClientPb'

export let backend: BackendClient

export function initializeBackend(cookieString: string) {
	const cookies = cookie.parse(cookieString)
	const port = cookies['GRPC_PORT']
	if (!port) {
		throw new Error("GRPC_PORT is not set!")
	}

	backend = new BackendClient(`ws://localhost${port}`)
}
