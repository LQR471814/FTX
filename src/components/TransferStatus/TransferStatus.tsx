import 'styling/Widget.css'
import Transfer from './Transfer'

type Props = {
  activeTransfers: Transfer[]
}

export type TransferState = {
  status: string
}

export default function TransferStatus(props: Props) {
  return (
    <div className="ComponentContainer">
      {
        props.activeTransfers.map((t) => {
          return <Transfer state={t.state} />
        })
      }
    </div>
  )
}
