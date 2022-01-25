import UploadRegion from "components/UploadRegion/UploadRegion"
// eslint-disable-next-line import/no-webpack-loader-syntax
import UploadWorker from 'worker-loader!uploader/UploadClient.ts'

import { useApp } from "context/AppContext"
import { ManagerBound, WorkerBound } from "uploader/UploadTypes"
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
				const handler = (msg: ManagerBound) => {
					switch (msg.type) {
						case 'state':
							ctx.dispatch({
								type: "transfer_update",
								id: props.context.peer,
								state: msg.state
							})

							break
						case 'done':
							ctx.dispatch({
								type: "transfer_update",
								id: props.context.peer,
								state: {
									status: "Upload Complete!",
									progress: NaN
								}
							})
							worker.terminate()
							break
						default:
							console.log(msg)
							break
					}
				}

				worker.onmessage = (e: MessageEvent) => handler(e.data as ManagerBound)

				ctx.dispatch({
					type: "transfer_new",
					id: uuidv4(),
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
