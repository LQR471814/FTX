import React from 'react';
import '../css/Window.css';
import '../css/MiniComponents.css';
import '../css/RootStyle.css';
import uniqid from 'uniqid';
import PropTypes from 'prop-types';
import Message from './Message';

class MessageList extends React.Component {
    render() {
        return (
            <div className="ComponentContainer" style={{overflowY: "scroll"}}>
                { this.props.messages.map((message)=>{
                    return <Message key={ uniqid() } text={ message.content } author={ message.author } />
                }) }
            </div>
        );
    }
}

MessageList.propTypes = {
    messages: PropTypes.array.isRequired
}

export default MessageList;