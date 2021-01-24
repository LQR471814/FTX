import React from "react"
import "../css/MiniComponents.css"

interface IProps {
  displayCommChoice: Function,
  setCurrentTargetUser: Function,
  name: string,
  ip: string
}

class User extends React.Component<IProps> {
  onClick = () => {
    this.props.setCurrentTargetUser(this.props.name)
    this.props.displayCommChoice(true)
  }

  render() {
    return (
      <div className="User" onClick={this.onClick}>
        <p className="UserName">{this.props.name}</p>
        <p className="Ip">{this.props.ip}</p>
      </div>
    )
  }
}

export default User
