import UploadRegion from "components/UploadRegion/UploadRegion"
// eslint-disable-next-line import/no-webpack-loader-syntax
import UploadWorker from 'worker-loader!components/TransferStatus/upload_worker_manager.js'

import { useApp } from "context/AppContext"
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
					type: "overlay_toggle",
					overlay: "uploadRegion",
					context: null
				})

				if (!files) return
				const worker = new UploadWorker()

				const updateCurrentState = (update: TransferState) => {
					const currentTransfer = ctx.state.activeTransfers[props.context.id]

					ctx.dispatch({
						type: "transfer_update",
						id: props.context.id,
						state: {
							...currentTransfer.state,
							...update
						}
					})
				}

				worker.onmessage = (e: MessageEvent) => {
					const msg = e.data

					switch (msg.type) {
						case 'status':
							updateCurrentState({ status: msg.message })
							console.log(msg.message)
							break
						case 'error':
							updateCurrentState(msg.message)
							worker.terminate()
							break
						case 'read_progress':
							const readDisplay = `Reading in progress: ${Math.round((msg.loaded / msg.total) * 100)}%`
							updateCurrentState({status: readDisplay})

							console.log(readDisplay)
							break
						case 'upload_progress':
							const uploadDisplay = `Uploading: ${Math.round((msg.loaded / msg.total) * 100)}%`
							updateCurrentState({status: uploadDisplay})

							console.log(uploadDisplay)
							break
						case 'terminate_worker':
							worker.terminate()
							break
						default:
							console.log(msg)
							break
					}
				}

				ctx.dispatch({
					type: "transfer_new",
					id: props.context.id,
					initial: {
						worker: worker,
						state: transferStateDefaults()
					}
				})

				worker.postMessage(
					{
						type: 'start',
						targetIp: props.context.id,
						files: Array.from(files)
					}
				)
			}
		} />
	)
}
