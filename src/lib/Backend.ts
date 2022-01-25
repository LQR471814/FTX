import { BackendClient } from 'lib/api/BackendServiceClientPb'

export let backend: BackendClient

export function initializeBackend() {
	backend = new BackendClient(`http://${window.location.host}`)
}
