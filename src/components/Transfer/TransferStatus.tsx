import Icon, { IconAssets } from 'components/Common/Icon'
import ProgressBar from 'components/Common/ProgressBar'
import { useApp } from 'context/AppContext'
import { TransferState, User } from 'lib/apptypes'
import { uniqueId } from 'lib/Utils'

function TransferComponent(props: { user: User, state: TransferState }) {
  return (
    <div className="block relative p-5">
      <div className="flex justify-around">
        <span className="title overflow-ellipsis overflow-hidden">
          {props.state.status}
        </span>
        <Icon asset={IconAssets.transfer} />
        <span className="title">{props.user.name}</span>
      </div>

      <div style={{
        margin: "3px",
        marginLeft: "5px",
        marginRight: "5px",
      }}>
        {!isNaN(props.state.progress) ?
          <ProgressBar progress={props.state.progress} />
          : undefined}
      </div>
    </div>
  )
}

export default function TransferStatus() {
  const ctx = useApp()
  return (
    <div className="flex-col component-container">
      {Object.values(ctx.state.activeTransfers).map((t) => {
        return <TransferComponent
          key={uniqueId('Transfer')}
          state={t.state}
          user={ctx.state.users[t.peer]}
        />
      })}
    </div>
  )
}
