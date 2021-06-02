import { useState } from "react"

interface Props {
  worker: Worker
}

export default function Transfer(props: Props) {
  const [currentStatus, setCurrentStatus] = useState('Initializing...')

  props.worker.onmessage = (e: MessageEvent) => {
    const msg = e.data

    switch (msg.type) {
      case 'status':
        setCurrentStatus(msg.message)
        console.log(msg.message)
        break
      case 'error':
        setCurrentStatus(msg.message)
        props.worker.terminate()
        break
      case 'read_progress':
        const readDisplay = `Reading in progress: ${Math.round((msg.loaded / msg.total) * 100)}%`
        setCurrentStatus(readDisplay)

        console.log(readDisplay)
        break
      case 'upload_progress':
        const uploadDisplay = `Uploading: ${Math.round((msg.loaded / msg.total) * 100)}%`
        setCurrentStatus(uploadDisplay)

        console.log(uploadDisplay)
        break
      case 'terminate_worker':
        props.worker.terminate()
        break
      default:
        console.log(msg)
        break
    }
  }

  return (
    <div>
      <span>{currentStatus}</span>
    </div>
  )
}
