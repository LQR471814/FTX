import ProgressBar from "components/Misc/ProgressBar"
import "./css/Transfer.css"

type Props = {
  state: TransferState
}

export default function TransferComponent(props: Props) {
  return (
    <div style={{ display: "block" }}>
      <span className="Transfer-Status">{props.state.status}</span>
      {!isNaN(props.state.progress) ?
        <ProgressBar progress={props.state.progress} />
        : undefined}
    </div>
  )
}
