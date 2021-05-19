//? This component acts as a SINGULAR message
import "./css/MessagePanel.css"

interface Props {
  text: string,
  author: string
}

function Message(props: Props) {
  return (
    <div className="Message">
      <p className="MessageAuthor">{props.author}</p>
      <p className="MessageContent">{props.text}</p>
    </div>
  )
}

export default Message
