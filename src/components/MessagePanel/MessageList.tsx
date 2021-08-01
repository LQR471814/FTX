//? This component acts as a SINGLE message group containing a reply box and a bunch of messages

import { createRef, useCallback, useEffect } from "react"
import "styling/Widget.css"
import "styling/Root.css"
import "./css/MessagePanel.css"

import Message from "./Message"
import MessageInput from "./MessageInput"
import { useApp } from "context/AppContext"
import { uniqueId } from "lib/Utils"

import * as backendIntf from "lib/BackendController"

type Props = {
  group: MessageGroup
  ID: IP
}

function MessageList(props: Props) {
  const groupContainerRef = createRef<HTMLDivElement>()
  const messageGroupCollapsibleRef = createRef<HTMLDivElement>()

  const ctx = useApp()

  const onToggleCollapse = () => {
    ctx.dispatch({
      type: 'group_toggle_collapsed',
      id: props.ID
    })
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
    release(props.group.collapsed)
  }, [props.group.collapsed, release])

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
          <MessageInput onSubmit={(msg: string) => {
            backendIntf.resourceSocket.request(
              backendIntf.REQ_SEND_MESSAGE,
              {
                MessageDestination: props.ID,
                Message: msg
              }
            )


            ctx.dispatch({
              type: 'message_send',
              msg: msg,
              destination: props.ID
            })
          }} />
        </Message>

      </div>
    </div>
  )
}

export default MessageList
