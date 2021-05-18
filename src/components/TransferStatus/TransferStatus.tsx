interface IProps {
  activeWorkers: Worker[]
}

export default function TransferStatus(props: IProps) {
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
    <div>

    </div>
  )
}
