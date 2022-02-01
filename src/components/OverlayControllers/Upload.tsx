import UploadRegion from "components/UploadRegion/UploadRegion"
// eslint-disable-next-line import/no-webpack-loader-syntax
import UploadWorker from 'worker-loader!uploader/uploader.ts'

import { useApp } from "context/AppContext"
import { ManagerBound, WorkerBound } from "uploader/types"
import { v4 as uuidv4 } from "uuid"
import { UploadContext } from "lib/CascadingContext"
import { transferStateDefaults } from "context/Defaults"

interface Props {
	context: UploadContext
}

export default function Upload(props: Props) {
	const ctx = useApp()

	return (
		<UploadRegion onChosen={
			(files: FileList | null) => {
				ctx.dispatch({
					type: "overlay_display",
					overlay: "uploadRegion",
					display: false,
					context: null
				})

				if (!files) return

				const worker = new UploadWorker()

				const id = uuidv4()
				worker.onmessage = (e: MessageEvent) => {
					const msg = e.data as ManagerBound
					switch (msg.type) {
						case 'state':
							ctx.dispatch({
								type: "transfer_update",
								id: id,
								state: msg.state
							})
							break
						case 'done':
							setTimeout(() => {
								ctx.dispatch({
									type: "transfer_remove",
									id: id,
								})
							}, 3000)

							ctx.dispatch({
								type: "transfer_update",
								id: id,
								state: {
									status: msg.denied ? "Transfer Denied." : "Upload Complete!",
									progress: NaN
								}
							})

							worker.terminate()
							break
						default:
							console.error(msg)
							break
					}
				}

				ctx.dispatch({
					type: "transfer_new",
					id: id,
					initial: {
						worker: worker,
						peer: props.context.peer,
						outgoing: true,
						state: transferStateDefaults()
					}
				})

				worker.postMessage({
					type: 'start',
					context: {
						files: Array.from(files),
						server: `ws://${props.context.peer}:${props.context.port}`,
					}
				} as WorkerBound)
			}
		} />
	)
}
