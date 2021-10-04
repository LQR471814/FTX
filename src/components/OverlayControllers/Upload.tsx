import UploadRegion from "components/UploadRegion/UploadRegion"
// eslint-disable-next-line import/no-webpack-loader-syntax
import UploadWorker from 'worker-loader!components/uploader/UploadClient.ts'

import { useApp } from "context/AppContext"
import { transferStateDefaults } from "context/Defaults"
import { ManagerBound, WorkerBound } from "components/uploader/UploadTypes"

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
								id: props.context.id,
								state: msg.state
							})

							break
						case 'done':
							ctx.dispatch({
								type: "transfer_update",
								id: props.context.id,
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
					id: props.context.id,
					initial: {
						worker: worker,
						state: transferStateDefaults()
					}
				})

				worker.postMessage({
					type: 'start',
					context: {
						files: Array.from(files),
						server: `ws://${props.context.id}:${props.context.port}/sendFile`,
					}
				} as WorkerBound)
			}
		} />
	)
}
