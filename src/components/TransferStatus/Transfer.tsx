import { useState } from "react"

interface Props {
  worker: Worker
}

export default function Transfer(props: Props) {
  const [currentState, setCurrentState] = useState('Initializing...')

  props.worker.onmessage = (e: MessageEvent) => {
    const msg = e.data

    switch (msg.type) {
      case 'state':
        setCurrentState(msg.message)
        console.log(msg.message)
        break
      case 'read_progress':
        const readDisplay = `Reading in progress: ${Math.round((msg.loaded / msg.total) * 100)}%`
        setCurrentState(readDisplay)

        console.log(readDisplay)
        break
      case 'upload_progress':
        const uploadDisplay = `Uploading ${Math.round((msg.loaded / msg.total) * 100)}%...`
        setCurrentState(uploadDisplay)

        console.log(uploadDisplay)
        break
      default:
        console.log(msg)
        break
    }
  }

  return (
    <div>
      <span>{currentState}</span>
    </div>
  )
}
