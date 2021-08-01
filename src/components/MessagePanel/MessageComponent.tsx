//? This component contains all message groups

import { useEffect, useRef } from "react"
import "styling/Widget.css"
import "styling/Root.css"

import MessageList from "./MessageList"

type Props = {
  groups: Record<string, MessageGroup>
}

function MessageComponent(props: Props) {
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
        (ID) => {
          return (
            <MessageList
              group={props.groups[ID]}
              ID={ID}
              key={ID}
            />
          )
        }
      )}
    </div>
  )
}

export default MessageComponent
