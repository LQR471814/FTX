//? This component contains all message groups

import React, { useEffect, useRef } from "react"
import "styling/Widget.css"
import "styling/Root.css"

import MessageList from "./MessageList"

interface IProps {
  groups: Record<string, IMessageGroup>
  submitMessage: Function,
  setCollapsed: Function
}

function MessageComponent(props: IProps) {
  const prevScroll = useRef(0)

  useEffect(() => {
    document.getElementById("MessageGroupsContainer")!.scrollTop = prevScroll.current
  })

  return (
    <div
      className="ComponentContainer"
      id="MessageGroupsContainer"
      onScroll={() => { prevScroll.current = document.getElementById("MessageGroupsContainer")!.scrollTop }}
    >
      {Object.keys(props.groups).map(
        (key) => {
          return (
            <MessageList
              key={key}
              collapsed={props.groups[key].collapsed}
              messages={props.groups[key].messages}
              user={key}
              submitMessage={props.submitMessage}
              setCollapsed={props.setCollapsed}
            />
          )
        }
      )}
    </div>
  )
}

export default MessageComponent
