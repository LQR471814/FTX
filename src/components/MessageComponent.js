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
                {Object.keys(this.props.groups).map((key) => {return <MessageList key={key} defaultCollapsed={this.props.groups[key].defaultCollapsed} messages={this.props.groups[key].messages} user={key} submitMessage={this.props.submitMessage} />})}
            </div>
        );
    }
}

MessageComponent.propTypes = {
    groups: PropTypes.object.isRequired,
    submitMessage: PropTypes.func.isRequired
}

export default MessageComponent;