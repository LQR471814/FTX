import { useCallback, useState } from "react"
import "styling/Widget.css"
import "styling/Window.css"
import "./css/UserList.css"

import User from "./User"
import _ from "lodash"
import { w3cwebsocket as WebSocketClient } from "websocket"

interface IProps {
  hostname: string,
  onCommChosen: (identifier: Primitive | undefined) => void
  showCommChoice: Function
}

interface IDisplayUser {
  name: string,
  ip: string
}

const userUpdateClient = new WebSocketClient(
  "ws://localhost:3000/updateUsers"
)

let currentKey = 0

export default function UserList(props: IProps) {
  const [users, setUsers]: [IDisplayUser[], Function] = useState([])

  userUpdateClient.onopen = useCallback(() => {
    console.log("Connected to user update backend.")
    userUpdateClient.send("Connected")
  }, [])

  userUpdateClient.onmessage = useCallback((message) => {
    const addUser = async (user: IDisplayUser) => {
      while (props.hostname === undefined) {
        await new Promise((r) => setTimeout(r, 1))
      }
      if (user.name === props.hostname) {
        return
      }

      const newUsers: IDisplayUser[] = _.cloneDeep(users)
      newUsers.push(user)
      setUsers(newUsers)
    }

    const removeUser = (user: IDisplayUser) => {
      const newUsers = _.cloneDeep(users)
      newUsers.splice(newUsers.indexOf(user), 1)
      setUsers(newUsers)
    }

    if (typeof message.data === "string") {
      const messageObj = JSON.parse(message.data)
      console.log(messageObj)
      switch (messageObj.MsgType) {
        case "addUser":
          if (
            !users.some((user) => {
              return user.name === messageObj.Name && user.ip === messageObj.IP
            })
          ) {
            addUser({ name: messageObj.Name, ip: messageObj.IP })
          }
          break
        case "removeUser":
          removeUser({ name: messageObj.Name, ip: messageObj.IP })
          break
        default:
          break
      }
    }
  }, [props.hostname, users])

  const uniqueKey = (prefix: string) => {
    currentKey++
    return prefix + currentKey.toString()
  }

  return (
    <div className="ComponentContainer UserList">
      {users.map((user) => {
        return (
          <User
            onCommChosen={props.onCommChosen}
            key={uniqueKey("User_")}
            name={user.name}
            ip={user.ip}
            showCommChoice={props.showCommChoice}
          />
        )
      })}
    </div>
  )
}
