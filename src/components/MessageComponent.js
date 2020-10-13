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
import uniqid from 'uniqid';

class MessageComponent extends React.Component {
    constructor(props) {
        super(props)

        this.messageGroupRefs = {}
    }

    sendCollapse(collapse, user) {
        this.messageListRef[user].current.collapse(collapse)
    }

    sendFocus(focus, user) {
        this.messageGroupRefs[user].current.focusReply(focus)
    }

    render() {
        return (
            <div className="ComponentContainer" style={{overflowY: "scroll"}}>
                { this.props.groups.map((group)=>{
                    var messageGrpRef = React.createRef();
                    this.messageGroupRefs[group.user] = messageGrpRef;
                    return <MessageList key={uniqid()} messages={group.messages} user={group.user} ref={messageGrpRef} />
                }) }
            </div>
        );
    }
}

MessageComponent.propTypes = {
    groups: PropTypes.array.isRequired
}

export default MessageComponent;