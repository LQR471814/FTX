import React, { useState } from "react"
import "styling/Widget.css"
import "styling/Window.css"
import "./css/UserList.css"

import User from "./User"
import _ from "lodash"
import { w3cwebsocket as WebSocketClient } from "websocket"

interface IProps {
  hostname: string,
  displayCommChoice: Function,
  setCurrentTargetUser: Function
}

interface IDisplayUser {
  name: string,
  ip: string
}

export default function UserList(props: IProps) {
  let currentKey = 0
  const userUpdateClient = new WebSocketClient(
    "ws://localhost:3000/updateUsers"
  )

  const [users, setUsers] = useState([
    { name: "John", ip: "127.0.0.1" },
    { name: "John1", ip: "127.0.0.1" },
    { name: "John2", ip: "127.0.0.1" },
    { name: "John3", ip: "127.0.0.1" },
    { name: "John4", ip: "127.0.0.1" },
    { name: "John5", ip: "127.0.0.1" },
    { name: "John6", ip: "127.0.0.1" },
    { name: "John7", ip: "127.0.0.1" },
    { name: "John", ip: "127.0.0.1" },
    { name: "John", ip: "127.0.0.1" },
    { name: "John", ip: "127.0.0.1" },
    { name: "John", ip: "127.0.0.1" },
    { name: "John", ip: "127.0.0.1" },
    { name: "John", ip: "127.0.0.1" },
  ])

  userUpdateClient.onopen = () => {
    console.log("Connected to user update backend.")
    userUpdateClient.send("Connected")
  }

  userUpdateClient.onmessage = (message) => {
    if (typeof message.data === "string") {
      var messageObj = JSON.parse(message.data)
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
  }

  const uniqueKey = (prefix: string) => {
    currentKey++
    return prefix + currentKey.toString()
  }

  const addUser = async (user: IDisplayUser) => {
    while (props.hostname === undefined) {
      await new Promise((r) => setTimeout(r, 1))
    }
    if (user.name === props.hostname) {
      return
    }
    var newUsers = _.cloneDeep(users)
    newUsers.push(user)
    setUsers(newUsers)
  }

  const removeUser = (user: IDisplayUser) => {
    var newUsers = _.cloneDeep(users)
    newUsers.splice(newUsers.indexOf(user), 1)
    setUsers(newUsers)
  }

  return (
    <div className="ComponentContainer UserList">
      {users.map((user) => {
        return (
          <User
            key={uniqueKey("User_")}
            name={user.name}
            ip={user.ip}
            displayCommChoice={props.displayCommChoice}
            setCurrentTargetUser={props.setCurrentTargetUser}
          />
        )
      })}
    </div>
  )
}
