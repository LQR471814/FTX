import { useRef } from 'react'
import 'styling/Widget.css'
import Transfer from './Transfer'

interface Props {
  activeWorkers: Worker[]
}

export default function TransferStatus(props: Props) {
  const currentWorkerID = useRef(0)

  return (
    <div className="ComponentContainer">
      {
        props.activeWorkers.map((w) => {
          currentWorkerID.current += 1
          return <Transfer worker={w} key={currentWorkerID.current} />
        })
      }
    </div>
  )
}
