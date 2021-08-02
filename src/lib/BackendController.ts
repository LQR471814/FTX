import { BackendApiWS, BackendChannel } from "./BackendInterface"

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
	resourceSocket = new BackendApiWS(base + resourceSocketPath, [
		REQ_HOSTNAME,
		REQ_INTERFACES,
		REQ_SETUP_REQUIREMENT,
		REQ_SEND_MESSAGE
	], dev)

	userListUpdater = new BackendChannel(base + userListUpdaterPath, dev)
	recvMessage = new BackendChannel(base + recvMessageSocketPath, dev)
}
