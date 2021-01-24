import React from "react"
import "../css/Window.css"
import "../css/MiniComponents.css"
import User from "./User"
import _ from "lodash"
import { w3cwebsocket as WebSocketClient } from "websocket"

interface IProps {
  hostname: { value: string },
  displayCommChoice: Function,
  setCurrentTargetUser: Function
}

interface IState {
  users: Array<{ name: string, ip: string }>
}

interface IDisplayUser {
  name: string,
  ip: string
}

class UserList extends React.Component<IProps, IState> {
  private currentKey = 0
  private userUpdateClient = new WebSocketClient(
    "ws://localhost:3000/updateUsers"
  )

  constructor(props: any) {
    super(props)

    this.state = {
      users: [],
    }

    this.userUpdateClient.onopen = () => {
      console.log("Connected to backend.")
      this.userUpdateClient.send("Connected")
    }
    this.userUpdateClient.onmessage = (message) => {
      if (typeof message.data === "string") {
        var messageObj = JSON.parse(message.data)
        console.log(messageObj)
        switch (messageObj.MsgType) {
          case "addUser":
            if (
              !this.state.users.some((user) => {
                return user.name === messageObj.Name && user.ip === messageObj.IP
              })
            ) {
              this.addUser({ name: messageObj.Name, ip: messageObj.IP })
            }
            break
          case "removeUser":
            this.removeUser({ name: messageObj.Name, ip: messageObj.IP })
            break
          default:
            break
        }
      }
    }

    this.uniqueKey = this.uniqueKey.bind(this)
  }

  uniqueKey(prefix: string) {
    this.currentKey++
    return prefix + this.currentKey.toString()
  }

  async addUser(user: IDisplayUser) {
    while (this.props.hostname === undefined) {
      await new Promise((r) => setTimeout(r, 1))
    }
    if (user.name === this.props.hostname.value) {
      return
    }
    var newUsers = _.cloneDeep(this.state.users)
    newUsers.push(user)
    this.setState({ users: newUsers })
  }

  removeUser(user: IDisplayUser) {
    var newUsers = _.cloneDeep(this.state.users)
    newUsers.splice(newUsers.indexOf(user), 1)
    this.setState({ users: newUsers })
  }

  render() {
    return (
      <div className="Window" style={{ height: "40%" }}>
        <p className="Title">User List</p>
        <div className="ComponentContainer">
          {this.state.users.map((user) => {
            return (
              <User
                key={this.uniqueKey("User_")}
                name={user.name}
                ip={user.ip}
                displayCommChoice={this.props.displayCommChoice}
                setCurrentTargetUser={this.props.setCurrentTargetUser}
              />
            )
          })}
        </div>
      </div>
    )
  }
}

export default UserList
