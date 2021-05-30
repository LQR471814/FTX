import { useCallback, useState } from "react"
import "styling/Widget.css"
import "styling/Window.css"
import "./css/UserList.css"

import User from "./User"
import _ from "lodash"
import { w3cwebsocket as WebSocketClient } from "websocket"

interface Props {
  hostname: string,
  setShowCommChoice: (user: User) => void
}

const userUpdateClient = new WebSocketClient(
  "ws://localhost:3000/updateUsers"
)

let currentKey = 0

export default function UserList(props: Props) {
  const [users, setUsers]: [User[], Function] = useState([
    { name: "Joe", ip: "192.168.1.7:7777" },
    { name: "Joe", ip: "127.0.0.1:7777" },
    { name: "Joe", ip: "127.0.0.1:7777" },
    { name: "Joe", ip: "127.0.0.1:7777" },
    { name: "Joe", ip: "127.0.0.1:7777" },
    { name: "Joe", ip: "127.0.0.1:7777" },
    { name: "Joe", ip: "127.0.0.1:7777" },
    { name: "Joe", ip: "127.0.0.1:7777" },
    { name: "Joe", ip: "127.0.0.1:7777" },
    { name: "Joe", ip: "127.0.0.1:7777" },
    { name: "Joe", ip: "127.0.0.1:7777" },
    { name: "Joe", ip: "127.0.0.1:7777" },
    { name: "Joe", ip: "127.0.0.1:7777" },
  ])

  userUpdateClient.onopen = useCallback(() => {
    console.log("Connected to user update backend.")
    userUpdateClient.send("Connected")
  }, [])

  userUpdateClient.onmessage = useCallback((message) => {
    const addUser = async (user: User) => {
      while (props.hostname === undefined) {
        await new Promise((r) => setTimeout(r, 1))
      }
      if (user.name === props.hostname) {
        return
      }

      const newUsers: User[] = _.cloneDeep(users)
      newUsers.push(user)
      setUsers(newUsers)
    }

    const removeUser = (user: User) => {
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
            key={uniqueKey("User_")}
            name={user.name}
            ip={user.ip}
            setShowCommChoice={props.setShowCommChoice}
          />
        )
      })}
    </div>
  )
}
