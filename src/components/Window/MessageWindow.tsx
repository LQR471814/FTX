//? This component is just the overall window covering the container for all message groups

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
import "styling/Window.css"
import MessageComponent from "components/MessagePanel/MessageComponent"

interface IProps {
  groups: Record<string, IUserMessages>,
  submitMessage: Function,
  setCollapsed: Function
}

class MessageWindow extends React.Component<IProps> {
  render() {
    return (
      <div className="Col" style={{ overflow: "hidden" }}>
        <div className="Window" style={{ height: "100%", overflow: "hidden" }}>
          <p className="Title">Messages</p>
          <MessageComponent
            groups={this.props.groups}
            submitMessage={this.props.submitMessage}
            setCollapsed={this.props.setCollapsed}
          />
        </div>
      </div>
    )
  }
}

export default MessageWindow
