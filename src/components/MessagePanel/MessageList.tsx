//? This component acts as a SINGLE message group containing a reply box and a bunch of messages

import { createRef, useCallback, useEffect } from "react"
import "styling/Widget.css"
import "styling/Root.css"
import "./css/MessagePanel.css"

import Message from "./Message"
import MessageInput from "./MessageInput"

interface Props {
  collapsed: number,
  messages: Array<IMessage>,
  user: string,
  submitMessage: (messageContent: string, destHost: string) => void,
  setCollapsed: (user: string, collapsed: number) => void
}

function MessageList(props: Props) {
  const groupContainerRef = createRef<HTMLDivElement>()
  const messageGroupCollapsibleRef = createRef<HTMLDivElement>()

  let currentKey = 0

  const uniqueKey = (prefix: string) => {
    currentKey++
    return prefix + currentKey.toString()
  }

  const onToggleCollapse = () => {
    props.setCollapsed(props.user, props.collapsed * -1)
  }

  const release = useCallback((released: number) => {
    if (released >= 0) {
      groupContainerRef.current!.style.maxHeight = "0px"
      return
    }

    Object.assign(groupContainerRef.current!.style, {
      background: '',
      maxHeight: groupContainerRef.current!.scrollHeight.toString() + "px"
    })

    groupContainerRef.current!.classList.add('Uncollapsed')
    messageGroupCollapsibleRef.current!.classList.add('Uncollapsed')

    messageGroupCollapsibleRef.current!.style.borderRadius = "10px 10px 0px 0px"
  }, [groupContainerRef, messageGroupCollapsibleRef])

  const onCollapseFinish = () => {
    if (groupContainerRef.current!.style.maxHeight === "0px") {
      groupContainerRef.current!.style.background = 'none'

      messageGroupCollapsibleRef.current!.classList.remove('Uncollapsed')
      messageGroupCollapsibleRef.current!.style.borderRadius = "10px"
    }
  }

  useEffect(() => {
    release(props.collapsed)
  }, [props.collapsed, release])

  return (
    <div className="MessageList">
      <div
        className="MessageGroupCollapsible"
        onClick={onToggleCollapse}
        ref={messageGroupCollapsibleRef}
      >
        <span className="MessageGroupUser">{props.user}</span>
      </div>

      <div
        className="MessageGroupContainer"
        onTransitionEnd={onCollapseFinish}
        ref={groupContainerRef}
      >
        {props.messages.map((message) => {
          return (
            <Message
              key={uniqueKey("Message_")}
              text={message.content}
              author={message.author}
            />
          )
        })}

        <Message>
          <MessageInput onSubmit={(msg: string) => {
            props.submitMessage(msg, props.user)
          }} />
        </Message>

      </div>
    </div>
  )
}

export default MessageList
