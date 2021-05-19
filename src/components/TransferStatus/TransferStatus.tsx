import 'styling/Widget.css'

interface Props {
  activeWorkers: Worker[]
}

export default function TransferStatus(props: Props) {
  for (const worker of props.activeWorkers) {
    worker.onmessage = (e: MessageEvent) => {
      const msg = e.data

      switch (msg.type) {
        case 'state':
          console.log(msg.message)
          break
        case 'read_progress':
          console.log(`Reading in progress: ${msg.percent}`)
          break
        default:
          console.log(msg)
          break
      }
    }
  }

  return (
    <div className="ComponentContainer">

    </div>
  )
}
