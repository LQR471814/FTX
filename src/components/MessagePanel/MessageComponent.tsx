//? This component contains all message groups

import { useEffect, useRef } from "react"
import MessageList from "./MessageList"
import { useApp } from "context/AppContext"

function MessageComponent() {
  const ctx = useApp()
  const prevScroll = useRef(0)

  useEffect(() => {
    document.getElementById(
      "MessageGroupsContainer"
    )!.scrollTop = prevScroll.current
  })

  return (
    <div
      className="component-container flex-col"
      id="MessageGroupsContainer"
      onScroll={
        () => {
          prevScroll.current = document.getElementById(
            "MessageGroupsContainer"
          )!.scrollTop
        }
      }
    >
      {Object.keys(ctx.state.messageGroups).map(
        (IP) => {
          return (
            <MessageList
              group={ctx.state.messageGroups[IP]}
              IP={IP}
              key={IP}
            />
          )
        }
      )}
    </div>
  )
}

export default MessageComponent
