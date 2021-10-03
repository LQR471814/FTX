import { uniqueId } from 'lib/Utils'
import 'styling/Widget.css'
import TransferComponent from './Transfer'

type Props = {
  activeTransfers: Transfer[]
}

export default function TransferStatus(props: Props) {
  return (
    <div
      style={{ display: "block" }}
      className="ComponentContainer"
    >
      {
        props.activeTransfers.map((t) => {
          return <TransferComponent
            key={uniqueId('Transfer')}
            state={t.state}
          />
        })
      }
    </div>
  )
}
