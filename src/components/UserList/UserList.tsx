import "styling/Widget.css"
import "./css/UserList.css"

import User from "./User"
import * as backendIntf from "lib/BackendController"
import { useApp } from "context/AppContext"
import { uniqueId } from "lib/Utils"

export default function UserList() {
  const ctx = useApp()
  const users = ctx.state.users

  const onStartCommunication = (user: User) => {
    ctx.dispatch({
      type: 'overlay_toggle',
      overlay: 'commChoice',
      context: {
        id: user.ip
      }
    })
  }

  backendIntf.userListUpdater.listen((msg) => {
    const user = { name: msg.Name, ip: msg.IP }

    switch (msg.MsgType) {
      case "addUser":
        //? Check if added user does not already exist in users
        if (!Object.keys(users).some(
          (user) => {
            return users[user].name === msg.Name
              && users[user] === msg.IP
          }
        )) {
          ctx.dispatch({
            type: 'user_add',
            user: {
              name: msg.Name,
              ip: msg.IP
            }
          })
        }
        break
      case "removeUser":
        ctx.dispatch({
          type: 'user_remove',
          id: user.ip
        })
        break
    }
  })

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
    </div>
  )
}
