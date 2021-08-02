import { uniqueId } from 'lib/Utils'
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
          return <Transfer
            key={uniqueId('Transfer')}
            state={t.state}
          />
        })
      }
    </div>
  )
}
