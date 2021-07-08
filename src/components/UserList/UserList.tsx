import { useRef, useState } from "react"
import "styling/Widget.css"
import "./css/UserList.css"

import User from "./User"
import _ from "lodash"
import * as backendIntf from "lib/BackendInterface"

interface Props {
  hostname: string,
  setShowCommChoice: (user: User) => void
}

export default function UserList(props: Props) {
  const [users, setUsers]: [User[], Function] = useState([
    { name: "Joe", ip: "192.168.1.7:7777" },
    { name: "Joe", ip: "192.168.1.2:7777" },
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

  if (false)
  backendIntf.userListUpdater.listen((msg) => {
    const user = { name: msg.Name, ip: msg.IP }

    switch (msg.MsgType) {
      case "addUser":
        if (!users.some(
          (user) => {
            return user.name === msg.Name
              && user.ip === msg.IP
          }
        )) {
          addUser(user)
        }
        break
      case "removeUser":
        removeUser(user)
        break
    }
  })

  const currentKey = useRef(0)
  const uniqueKey = (prefix: string) => {
    currentKey.current++
    return prefix + currentKey.current.toString()
  }

  return (
    <div className="ComponentContainer">
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
