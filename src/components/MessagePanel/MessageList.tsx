//? This component acts as a SINGLE message group containing a reply box and a bunch of messages

import { createRef, useCallback, useEffect } from "react"
import "styling/Widget.css"
import "styling/Root.css"
import "./css/MessagePanel.css"

import Message from "./Message"
import MessageInput from "./MessageInput"
import { useApp } from "context/AppContext"
import { uniqueId } from "lib/Utils"
import { backend } from "lib/Backend"
import { MessageRequest, Message as MessageType, User } from "lib/api/backend_pb"
import { MessageGroup } from "lib/apptypes"

type Props = {
  group: MessageGroup
  IP: string
}

function MessageList(props: Props) {
  const groupContainerRef = createRef<HTMLDivElement>()
  const messageGroupCollapsibleRef = createRef<HTMLDivElement>()

  const ctx = useApp()

  const onToggleCollapse = () => {
    ctx.dispatch({
      type: 'group_display',
      display: !props.group.displayed,
      id: props.IP
    })
  }

  const display = useCallback((display: boolean) => {
    if (!display) {
      groupContainerRef.current!.style.maxHeight = "0px"
      return
    }

    Object.assign(groupContainerRef.current!.style, {
      background: '',
      maxHeight: groupContainerRef.current!.scrollHeight.toString() + "px"
    })

    groupContainerRef.current!.classList.add('Uncollapsed')
    messageGroupCollapsibleRef.current!.classList.add('Uncollapsed')

    messageGroupCollapsibleRef.current!.style.borderRadius = "var(--very-round) var(--very-round) 0px 0px"
  }, [groupContainerRef, messageGroupCollapsibleRef])

  const onCollapseFinish = () => {
    if (groupContainerRef.current!.style.maxHeight === "0px") {
      groupContainerRef.current!.style.background = 'none'

      messageGroupCollapsibleRef.current!.classList.remove('Uncollapsed')
      messageGroupCollapsibleRef.current!.style.borderRadius = ""
    }
  }

  useEffect(() => {
    display(props.group.displayed)
  }, [props.group.displayed, display])

  return (
    <div className="MessageList">
      <div
        className="MessageGroupCollapsible"
        onClick={onToggleCollapse}
        ref={messageGroupCollapsibleRef}
      >
        <span className="MessageGroupUser">{props.group.user.name}</span>
      </div>

      <div
        className="MessageGroupContainer"
        onTransitionEnd={onCollapseFinish}
        ref={groupContainerRef}
      >
        {props.group.messages.map((message) => {
          return (
            <Message
              key={uniqueId("Message")}
              text={message.content}
              author={message.author}
            />
          )
        })}

        <Message>
          <MessageInput onSubmit={(contents: string) => {
            const req = new MessageRequest()

            const author = new User()
            author.setName(ctx.state.self.name)
            author.setIp(ctx.state.self.ip)

            const msg = new MessageType()
            msg.setContents(contents)
            msg.setAuthor(author)

            const to = new User()
            to.setIp(props.IP)

            req.setMessage(msg)
            req.setTo(to)
            backend.sendMessage(req, null)

            ctx.dispatch({
              type: 'message_send',
              msg: contents,
              destination: props.IP
            })
          }} />
        </Message>

      </div>
    </div>
  )
}

export default MessageList
