//? This component acts as a SINGLE message group containing a reply box and a bunch of messages

import React from "react"
import "styling/Widget.css"
import "styling/Root.css"
import "./css/MessagePanel.css"

import Message from "./Message"
import { executeTransitionOffset } from "lib/TransitionHelper"

interface IProps {
  collapsed: number,
  messages: Array<IMessage>,
  user: string,
  submitMessage: Function,
  setCollapsed: Function
}

interface IState {
  msgIn: string
}

class MessageList extends React.Component<IProps, IState> {
  private groupContainerRef = React.createRef<HTMLDivElement>()
  private messageGroupCollapsibleRef = React.createRef<HTMLDivElement>()
  private submitButtonRef = React.createRef<HTMLDivElement>()
  private inputFieldRef = React.createRef<HTMLInputElement>()

  private currentKey = 0

  constructor(props: any) {
    super(props)

    this.state = {
      msgIn: ""
    }

    this.inputFieldRef = React.createRef()
  }

  componentDidMount() {
    this.release(this.props.collapsed)
  }

  componentDidUpdate() {
    this.release(this.props.collapsed)
  }

  uniqueKey = (prefix: string) => {
    this.currentKey++
    return prefix + this.currentKey.toString()
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ msgIn: e.target.value })
    if (e.target.value !== "") {
      this.showButton(true)
    } else {
      this.showButton(false)
    }
  }

  showButton = (show: boolean) => {
    if (show === true) {
      Object.assign(this.submitButtonRef.current!.style, {
        margin: "0px 5px 0px 5px",
        padding: "10px 5px 10px 5px",
      })
      executeTransitionOffset(this.submitButtonRef.current!, () => {
        this.submitButtonRef.current!.style.width = "40px"
      }, -100)
      // this.submitButtonRef.current!.style.width = this.submitButtonRef.current!.scrollWidth.toString() + "px"
      return
    }

    Object.assign(this.submitButtonRef.current!.style, {
      width: "0px",
    })
    executeTransitionOffset(this.submitButtonRef.current!, () => {
      Object.assign(this.submitButtonRef.current!.style, {
        margin: "0px",
        padding: "0px",
      })
    }, -100)
    // this.submitButtonRef.current!.style.width = "0px"
  }

  onToggleCollapse = () => {
    this.props.setCollapsed(this.props.user, this.props.collapsed * -1)
  }

  release = (released: number) => {
    if (released < 0) {
      this.groupContainerRef.current!.style.background =
        "linear-gradient(180deg, rgba(40,40,40,0.6979166666666667) 0%, rgba(255,255,255,0) 35%)"
      this.groupContainerRef.current!.style.maxHeight =
        this.groupContainerRef.current!.scrollHeight.toString() + "px"
      this.groupContainerRef.current!.style.height = "auto"
      this.messageGroupCollapsibleRef.current!.style.borderRadius =
        "10px 10px 0px 0px"
      this.inputFieldRef.current!.focus()
    } else {
      this.inputFieldRef.current!.blur()
      this.groupContainerRef.current!.style.maxHeight = "0px"
    }
  }

  onCollapseFinish = () => {
    if (this.groupContainerRef.current!.style.maxHeight === "0px") {
      this.groupContainerRef.current!.style.background = "none"
      this.messageGroupCollapsibleRef.current!.style.borderRadius = "10px"
    }
  }

  onSubmitMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      this.submitButtonRef.current!.style.backgroundColor = "#96fa60"
      this.submitButtonRef.current!.style.border = "1px solid #ffffff"
      this.submit()
    }
  }

  onSubmit = () => {
    this.submit()
  }

  submit = () => {
    if (this.state.msgIn === "") {
      return
    } else if (this.submitButtonRef.current!.className === "SubmitButton Activated") {
      this.submitButtonRef.current!.className = "SubmitButton"
      return
    }
    this.submitButtonRef.current!.className = "SubmitButton Activated"
    this.setState({ msgIn: "" })

    this.props.submitMessage(this.state.msgIn, this.props.user)
  }

  onButtonTransitionEnd = () => {
    if (this.submitButtonRef.current!.className === "SubmitButton Activated") {
      this.submitButtonRef.current!.style.backgroundColor = ""
      this.submitButtonRef.current!.style.border = ""
      this.submitButtonRef.current!.className = "SubmitButton"
      this.showButton(false)
    }
  }

  render() {
    return (
      <div className="MessageList">
        <div
          className="MessageGroupCollapsible"
          onClick={this.onToggleCollapse}
          ref={this.messageGroupCollapsibleRef}
        >
          <span className="MessageGroupUser">{this.props.user}</span>
        </div>

        <div
          className="MessageGroupContainer"
          onTransitionEnd={this.onCollapseFinish}
          ref={this.groupContainerRef}
        >
          {this.props.messages.map((message) => {
            return (
              <Message
                key={this.uniqueKey("Message_")}
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
                ref={this.inputFieldRef}
                placeholder="Message"
                onChange={this.onChange}
                onKeyDown={this.onSubmitMessage}
              />

              <div
                className="SubmitButton"
                onClick={this.onSubmit}
                ref={this.submitButtonRef}
                onTransitionEnd={this.onButtonTransitionEnd}
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
}

export default MessageList
