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

import React from 'react';
import '../css/Window.css';
import '../css/RootStyle.css';
import MessageComponent from './MessageComponent';
import PropTypes from 'prop-types';

class MessageWindow extends React.Component {
    constructor(props) {
        super(props)

        this.MessageComponentRef = React.createRef()
    }

    sendFocus(focus, user) {
        this.MessageComponentRef.current.sendFocus(focus, user)
    }

    render() {
        return (
            <div className="Col" style={{overflow: "hidden"}}>
                <div className="Window" style={{height: "100%", overflow: "hidden"}}>
                    <p className="Title">Messages</p>
                    <MessageComponent groups={this.props.groups} ref={this.MessageComponentRef} submitMessage={this.props.submitMessage} setCollapsed={this.props.setCollapsed} />
                </div>
            </div>
        );
    }
}

MessageWindow.propTypes = {
    groups: PropTypes.object.isRequired,
    submitMessage: PropTypes.func.isRequired,
    setCollapsed: PropTypes.func.isRequired
}

export default MessageWindow;