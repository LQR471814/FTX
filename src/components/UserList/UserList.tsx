import "styling/Widget.css"
import "./css/UserList.css"

import User from "./User"
import * as backendIntf from "lib/BackendController"
import { useEffect } from "react"
import { useApp } from "context/AppContext"
import { uniqueId } from "lib/Utils"

export default function UserList() {
  const ctx = useApp()
  const users = ctx.state.users

  const onStartCommunication = (user: User) => {
    ctx.dispatch({
      type: 'overlay_display',
      overlay: 'commChoice',
      display: true,
      context: {
        id: user.ip
      }
    })
  }

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
