import UserComponent from "./User"
import { useApp } from "context/AppContext"
import { uniqueId } from "lib/Utils"
import { User } from "lib/apptypes"

export default function UserList() {
  const ctx = useApp()
  const users = ctx.state.users

  const onStartCommunication = (user: User) => {
    ctx.dispatch({
      type: 'overlay_display',
      overlay: 'commChoice',
      display: true,
      context: {
        peer: user.ip,
        port: user.fileport
      }
    })
  }

  return (
    <div className="component-container">
      {Object.values(users).map((user) => {
        return (
          <UserComponent
            key={uniqueId('DisplayUser')}
            user={user}
            click={onStartCommunication}
          />
        )
      })}

      {Object.keys(users).length === 0 ?
        <p className="title m-auto p-3">
          There are currently no peers to interact with ):
        </p>
        : undefined}
    </div>
  )
}
