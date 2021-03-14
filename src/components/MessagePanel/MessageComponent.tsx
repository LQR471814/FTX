//? This component contains all message groups

//MESSAGE STATE STRUCTURE
//state {
//  messageGroups [
//    {
//       user: str
//       messages: [
//         {
//          content: str,
//          author: str
//         }
//       ]
//    }
//  ]
//}

import React from "react"
import "styling/Widget.css"
import "styling/Root.css"

import MessageList from "./MessageList"

interface IProps {
  groups: Record<string, IUserMessages>
  submitMessage: Function,
  setCollapsed: Function
}

class MessageComponent extends React.Component<IProps> {
  private prevScroll = 0

  getSnapshotBeforeUpdate() {
    this.prevScroll = document.getElementById("MessageGroupsContainer")!.scrollTop
    return null
  }

  componentDidUpdate() {
    document.getElementById("MessageGroupsContainer")!.scrollTop = this.prevScroll
  }

  render() {
    return (
      <div
        className="ComponentContainer"
        id="MessageGroupsContainer"
        style={{ overflowY: "scroll" }}
      >
        {Object.keys(this.props.groups).map((key) => {
          return (
            <MessageList
              key={key}
              collapsed={this.props.groups[key].collapsed}
              messages={this.props.groups[key].messages}
              user={key}
              submitMessage={this.props.submitMessage}
              setCollapsed={this.props.setCollapsed}
            />
          )
        })}
      </div>
    )
  }
}

export default MessageComponent
