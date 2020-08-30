import React from 'react';
import '../css/Window.css';
import '../css/RootStyle.css';

class Messages extends React.Component {
    render() {
        return (
            <div className="Col">
                <div className="Window">
                    <p className="Title">Messages</p>
                </div>
                <input className="InputField" type="text" name="MsgIn" id="MsgInField" placeholder="Message" />
            </div>
        );
    }
}

export default Messages;