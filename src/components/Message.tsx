//? This component acts as a SINGULAR message
import React from "react"
import "../css/MiniComponents.css"

interface IProps {
  text: string,
  author: string
}

class Message extends React.Component<IProps> {
  render() {
    return (
      <div className="Message">
        <p className="MessageAuthor">{this.props.author}</p>
        <p className="MessageContent">{this.props.text}</p>
      </div>
    )
  }
}

export default Message
