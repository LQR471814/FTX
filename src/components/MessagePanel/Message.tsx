import MessageInput from "./MessageInput"

type Props = {
  text?: string
  author?: string
  reply?: boolean
  onSubmit?: (value: string) => void
}

export default function Message(props: Props) {
  return (
    <div className="block p-3 mx-2 my-4 bg-neutral rounded-xl drop-shadow-lg break-words">
      <p className="m-0 font-regular-bold text-lg text-active">
        {props.reply ? "Reply" : props.author}
      </p>
      <p className="m-1 font-regular-bold text-xl text-highlight">
        {props.reply
            ? <MessageInput onSubmit={props.onSubmit!} />
            : props.text}
      </p>
    </div>
  )
}
