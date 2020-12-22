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

import React from "react";
import "../css/Window.css";
import "../css/RootStyle.css";
import MessageList from "./MessageList";
import PropTypes from "prop-types";

class MessageComponent extends React.Component {
  getSnapshotBeforeUpdate(prevProps, prevState) {
    this.prevScroll = document.getElementById(
      "MessageGroupsContainer"
    ).scrollTop;
    return null;
  }

  componentDidUpdate() {
    document.getElementById(
      "MessageGroupsContainer"
    ).scrollTop = this.prevScroll;
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
          );
        })}
      </div>
    );
  }
}

MessageComponent.propTypes = {
  groups: PropTypes.object.isRequired,
  submitMessage: PropTypes.func.isRequired,
  setCollapsed: PropTypes.func.isRequired,
};

export default MessageComponent;
