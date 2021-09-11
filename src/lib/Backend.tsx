import { BackendClient } from 'lib/BackendServiceClientPb'

export let backend: BackendClient

export function initializeBackend() {
	backend = new BackendClient(`ws://${window.location.host}`)
}
