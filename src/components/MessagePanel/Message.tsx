import "./css/Message.css"

interface Props {
  text?: string,
  author?: string

  children?: React.ReactChild
}

export default function Message(props: Props) {
  return (
    <div className="Message">
      {props.children ? props.children : null}

      {(props.text && props.author) ? (
        <div className="Block" style={{
          wordBreak: "break-word",
        }}>
          <p className="MessageAuthor">{props.author}</p>
          <p className="MessageContent">{props.text}</p>
        </div>
      ) : null}
    </div>
  )
}
