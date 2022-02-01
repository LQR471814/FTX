//? This component acts as a SINGLE message group containing a reply box and a bunch of messages

import { createRef, useCallback, useEffect, useRef } from "react"
import Message from "./Message"
import { useApp } from "context/AppContext"
import { uniqueId } from "lib/Utils"
import { backend } from "lib/Backend"
import { MessageRequest } from "lib/api/backend_pb"
import { MessageGroup } from "lib/apptypes"

type Props = {
  group: MessageGroup
  IP: string
}

export default function MessageList(props: Props) {
  const groupContainerRef = createRef<HTMLDivElement>()
  const collapsibleRef = createRef<HTMLDivElement>()

  const baseGroupClass = "block p-1 transition-all duration-300 overflow-hidden"
  const hiddenGroup = "max-h-0"
  const displayedGroup = "max-h-auto dropdown-gradient p-3"

  const groupAddendum = useRef(hiddenGroup);

  const baseCollapsibleClass = [
    "block bg-neutral-light bg-opacity-50 p-3 border-active",
    "transition-all duration-100",
    "hover:bg-opacity-70 hover:cursor-pointer hover:border-2",
    "active:bg-opacity-100 active:border-neutral"
  ].join(' ')
  const hiddenCollapsible = "rounded-2xl"
  const displayedCollapsible = "rounded-t-2xl"

  const collapsibleAddendum = useRef(hiddenCollapsible)

  const ctx = useApp()

  const createClass = (base: string, addendum: string) =>
    base + ' ' + addendum

  const onToggleCollapse = () => {
    ctx.dispatch({
      type: 'group_display',
      display: !props.group.displayed,
      peer: props.IP
    })
  }

  const display = useCallback((display: boolean) => {
    const newGroupAddendum = display ? displayedGroup : hiddenGroup
    const newCollapsibleAddendum = display ? displayedCollapsible : hiddenCollapsible

    groupAddendum.current = newGroupAddendum
    groupContainerRef.current!.className = `${baseGroupClass} ${newGroupAddendum}`

    collapsibleAddendum.current = newCollapsibleAddendum
    collapsibleRef.current!.className = `${baseCollapsibleClass} ${newCollapsibleAddendum}`
  }, [baseCollapsibleClass, collapsibleRef, groupContainerRef])

  useEffect(() => {
    display(props.group.displayed)
  }, [props.group.displayed, display])

  return (
    <div className="block w-full mb-3">
      <div
        className={baseCollapsibleClass}
        onClick={onToggleCollapse}
        ref={collapsibleRef}
      >
        <span className="font-regular-bold text-highlight m-1 text-3xl select-none">
          {ctx.state.users[props.group.user].name}
        </span>
      </div>

      <div
        className={createClass(baseGroupClass, groupAddendum.current)}
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

        <Message
          reply={true}
          onSubmit={(contents: string) => {
            const req = new MessageRequest()
            req.setMessage(contents)
            req.setTo(props.IP)

            backend.sendMessage(req, null)

            ctx.dispatch({
              type: 'message_send',
              msg: contents,
              destination: props.IP
            })
          }}
        />
      </div>
    </div>
  )
}
