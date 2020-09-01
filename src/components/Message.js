import React from 'react';
import '../css/MiniComponents.css';
import PropTypes from 'prop-types';

class Message extends React.Component {
    render() {
        return (
            <div className="Message">
                <p className="MessageContent">{this.props.author}: {this.props.text}</p>
            </div>
        );
    }
}

Message.propTypes = {
    text: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired
}

export default Message;