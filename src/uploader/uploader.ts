import { Transfer, File as FTPFile, Hooks } from 'websocket-ftp'
import { ManagerBound, WorkerBound } from './types'

async function convertFiles(files: File[]): Promise<FTPFile[]> {
	const result: FTPFile[] = []
	for (const f of files) {
		const bytes = await f.arrayBuffer()
		result.push({
			Name: f.name,
			Size: bytes.byteLength,
			Type: f.type,
			data: bytes,
		})
	}
	return result
}

let t: Transfer | null

onmessage = (message) => {
	const m = message.data as WorkerBound
	switch (m.type) {
		case "start":
			convertFiles(m.context.files).then(
				files =>
					t = new Transfer(m.context.server, files, hooks)
			)
			break
		case "cancel":
			if (t === null) throw new Error(
				"Transfer was canceled before it was initialized!"
			)
			t.cancel()
	}
}

let denied = true

const hooks: Hooks = {
	onstart: () => postMessage({
			type: "state",
			state: { status: "Initializing..." }
		} as ManagerBound),
	onprogress: (s, t) => postMessage({
			type: "state",
			state: {
				status: "Uploading File...",
				progress: s / t
			}
		} as ManagerBound),
	onsuccess: () => denied = false,
	onclose: () => postMessage({ type: "done", denied: denied })
}
