import { TransferState } from './TransferStatus'

type Props = {
  state: TransferState
}

export default function Transfer(props: Props) {
  return (
    <div>
      <span>{props.state.status}</span>
    </div>
  )
}
