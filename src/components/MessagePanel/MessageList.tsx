//? This component acts as a SINGLE message group containing a reply box and a bunch of messages

import { createRef, useCallback, useEffect, useState } from "react"
import "styling/Widget.css"
import "styling/Root.css"
import "./css/MessagePanel.css"

import Message from "./Message"
import { transitionEffectOffset } from "lib/Utils"

interface Props {
  collapsed: number,
  messages: Array<IMessage>,
  user: string,
  submitMessage: Function,
  setCollapsed: Function
}

function MessageList(props: Props) {
  const groupContainerRef = createRef<HTMLDivElement>()
  const messageGroupCollapsibleRef = createRef<HTMLDivElement>()
  const submitButtonRef = createRef<HTMLDivElement>()
  const inputFieldRef = createRef<HTMLInputElement>()

  let currentKey = 0

  const [msgIn, setMsgIn] = useState("")

  const uniqueKey = (prefix: string) => {
    currentKey++
    return prefix + currentKey.toString()
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsgIn(e.target.value)
    if (e.target.value !== "") {
      showButton(true)
    } else {
      showButton(false)
    }
  }

  const showButton = (show: boolean) => {
    if (show === true) {
      Object.assign(submitButtonRef.current!.style, {
        margin: "0px 4px 0px 8px",
        padding: "10px 5px 10px 5px",
      })

      transitionEffectOffset(submitButtonRef.current!, (element) => {
        element.style.width = "40px"
      }, -100)
      // submitButtonRef.current!.style.width = submitButtonRef.current!.scrollWidth.toString() + "px"
      return
    }

    Object.assign(submitButtonRef.current!.style, {
      width: "0px",
    })
    transitionEffectOffset(submitButtonRef.current!, (element) => {
      Object.assign(element.style, {
        margin: "0px",
        padding: "0px",
      })
    }, -100)
    // submitButtonRef.current!.style.width = "0px"
  }

  const onToggleCollapse = () => {
    props.setCollapsed(props.user, props.collapsed * -1)
  }

  const release = useCallback((released: number) => {
    if (released >= 0) {
      inputFieldRef.current!.blur()
      groupContainerRef.current!.style.maxHeight = "0px"
      return
    }

    groupContainerRef.current!.style.maxHeight = groupContainerRef.current!.scrollHeight.toString() + "px"

    groupContainerRef.current!.classList.add('Uncollapsed')
    messageGroupCollapsibleRef.current!.classList.add('Uncollapsed')

    messageGroupCollapsibleRef.current!.style.borderRadius = "10px 10px 0px 0px"
    inputFieldRef.current!.focus()
  }, [groupContainerRef, inputFieldRef, messageGroupCollapsibleRef])

  const onCollapseFinish = () => {
    if (groupContainerRef.current!.style.maxHeight === "0px") {
      groupContainerRef.current!.style.background = "none"
      messageGroupCollapsibleRef.current!.classList.remove('Uncollapsed')
      messageGroupCollapsibleRef.current!.style.borderRadius = "10px"
    }
  }

  const onSubmitMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submitButtonRef.current!.style.backgroundColor = "#96fa60"
      submitButtonRef.current!.style.border = "1px solid #ffffff"
      submit()
    }
  }

  const submit = () => {
    if (msgIn === "") {
      return
    } else if (submitButtonRef.current!.className === "SubmitButton Activated") {
      submitButtonRef.current!.className = "SubmitButton"
      return
    }
    submitButtonRef.current!.className = "SubmitButton Activated"
    setMsgIn("")

    props.submitMessage(msgIn, props.user)
  }

  const onButtonTransitionEnd = () => {
    if (submitButtonRef.current!.className === "SubmitButton Activated") {
      submitButtonRef.current!.style.backgroundColor = ""
      submitButtonRef.current!.style.border = ""
      submitButtonRef.current!.className = "SubmitButton"
      showButton(false)
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

        <div className="Message">
          <p className="MessageAuthor">Reply</p>
          <div
            style={{
              margin: "10px 5px 5px 5px",
              display: "flex",
              overflow: "hidden",
            }}
          >

            <input
              tabIndex={-1}
              className="InputField"
              ref={inputFieldRef}
              placeholder="Message"
              onChange={onChange}
              onKeyDown={onSubmitMessage}
            />

            <div
              className="SubmitButton"
              onClick={submit}
              ref={submitButtonRef}
              onTransitionEnd={onButtonTransitionEnd}
            >

              <svg
                height="12px"
                width="30px"
                viewBox="75 0 150 200"
                transform="rotate(90 0 0)"
                style={{ fill: "#4d4d4d" }}
              >
                <path d="M150 0 L75 200 L225 200 Z"></path>
              </svg>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageList
