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

import React from 'react';
import '../css/Window.css';
import '../css/RootStyle.css';
import MessageList from './MessageList';
import PropTypes from 'prop-types';

class MessageComponent extends React.Component {
    render() {
        return (
            <div className="ComponentContainer" style={{overflowY: "scroll"}}>
                { this.props.groups.map((group) => {
                    return <MessageList key={group.user} defaultCollapsed={group.defaultCollapsed} messages={group.messages} user={group.user} submitMessage={this.props.submitMessage} />
                }) }
            </div>
        );
    }
}

MessageComponent.propTypes = {
    groups: PropTypes.array.isRequired,
    submitMessage: PropTypes.func.isRequired
}

export default MessageComponent;