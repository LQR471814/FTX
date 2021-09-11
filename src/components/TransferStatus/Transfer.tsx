import ProgressBar from "components/Misc/ProgressBar"
import { TransferState } from "lib/apptypes"
import "./css/Transfer.css"

type Props = {
  state: TransferState
}

export default function Transfer(props: Props) {
  return (
    <div style={{ display: "block" }}>
      <span className="Transfer-Status">{props.state.status}</span>
      {!isNaN(props.state.progress) ?
        <ProgressBar progress={props.state.progress} />
        : undefined}
    </div>
  )
}
