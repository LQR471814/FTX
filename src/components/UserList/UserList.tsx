import "styling/Widget.css"
import "./css/UserList.css"

import User from "./User"
import { useApp } from "context/AppContext"
import { uniqueId } from "lib/Utils"
import { User as UserType } from "context/State"

export default function UserList() {
  const ctx = useApp()
  const users = ctx.state.users

  const onStartCommunication = (user: UserType) => {
    ctx.dispatch({
      type: 'overlay_display',
      overlay: 'commChoice',
      display: true,
      context: {
        id: user.ip
      }
    })
  }

  return (
    <div className="ComponentContainer">
      {Object.values(users).map((user) => {
        return (
          <User
            key={uniqueId('DisplayUser')}
            user={user}
            click={onStartCommunication}
          />
        )
      })}

      {Object.keys(users).length === 0 ?
        <p
          className="Tag"
          style={{ maxWidth: "190px", margin: "auto", padding: "10px" }}
        >
          There are currently no peers to interact with ):
        </p>
        : undefined}
    </div>
  )
}
