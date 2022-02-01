//? This component contains all message groups

import { useEffect, useRef } from "react"
import MessageList from "./MessageList"
import { MessageGroup } from "lib/apptypes"

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
      className="component-container"
      id="MessageGroupsContainer"
      style={{ flexDirection: "column" }}
      onScroll={() => { prevScroll.current = document.getElementById("MessageGroupsContainer")!.scrollTop }}
    >
      {Object.keys(props.groups).map(
        (IP) => {
          return (
            <MessageList
              group={props.groups[IP]}
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
