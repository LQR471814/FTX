//? This component acts as a SINGULAR message
import React from "react"
import "./css/MessagePanel.css"

interface IProps {
  text: string,
  author: string
}

function Message(props: IProps) {
  return (
    <div className="Message">
      <p className="MessageAuthor">{props.author}</p>
      <p className="MessageContent">{props.text}</p>
    </div>
  )
}

export default Message
