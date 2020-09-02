//MESSAGE STATE STRUCTURE
//state {
//  messageChannels [
//    {
//       chanUser: str
//       chanIndex: int
//       chanMessages: [
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
import { eel } from '../eel';

class MessageComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {msgIn:"", submitStyle:"SubmitButton"}
        
        this.handleChange = this.handleChange.bind(this);
        this.checkSubmit = this.checkSubmit.bind(this);
        this.clickedSubmit = this.clickedSubmit.bind(this);
        this.onButtonAnimationEnd = this.onButtonAnimationEnd.bind(this);
    }
    
    async handleChange(event) {
        this.setState({msgIn: event.target.value})
        if (event.target.value !== "") {
            document.getElementById("MsgInField").style.width = "91.3%"
            await new Promise(r => setTimeout(r, 100));
            document.getElementById("SubmitButton").style.display = "block"
        } else {
            document.getElementById("SubmitButton").style.display = "none"
            await new Promise(r => setTimeout(r, 50));
            document.getElementById("MsgInField").style.width = "100%"
        }
    }

    checkSubmit(event) {
        if (event.key === 'Enter') {
            this.submit()
        }
    }

    clickedSubmit(event) {
        this.submit()   
    }

    submit() {
        if (this.state.msgIn === "") {
            return
        } else if (this.state.submitStyle === "SubmitButton Activated") {
            this.setState({submitStyle: "SubmitButton"})
            return
        }
        var newMessages = this.props.channels[this.props.currentChannel].channelMessages
        newMessages.push({content: this.state.msgIn, author: "You"})
        
        this.props.setMessages(newMessages, this.props.currentChannel)

        this.setState({submitStyle:"SubmitButton Activated"})
        this.setState({msgIn:""})
        document.getElementById("MsgInField").value = ""
    }

    async onButtonAnimationEnd(event) {
        this.setState({submitStyle:"SubmitButton"})
        if (this.state.submitStyle === "SubmitButton Activated") {
            document.getElementById("SubmitButton").style.display = "none"
            await new Promise(r => setTimeout(r, 75));
            document.getElementById("MsgInField").style.width = "100%"
        }
    }

    render() {
        return (
            <div className="Col" style={{overflow: "hidden"}}>
                <div className="Window" style={{height: "100%", overflow: "hidden"}}>
                    <p className="Title">Messages - {this.props.channels[this.props.currentChannel].user}</p>
                    <MessageList messages={this.props.channels[this.props.currentChannel].channelMessages} />
                </div>
                <div style={{display:"flex"}}>
                    <input className="InputField" type="text" name="MsgIn" id="MsgInField" placeholder="Message" onKeyDown={this.checkSubmit} onChange={this.handleChange} />
                    <button className={this.state.submitStyle} id="SubmitButton" onClick={this.clickedSubmit} onTransitionEnd={this.onButtonAnimationEnd} style={{display: "none"}}>
                        <svg height="12px" width="30px" viewBox="75 0 150 200" transform="rotate(90 0 0)">
                            <path d="M150 0 L75 200 L225 200 Z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        );
    }
}

MessageComponent.propTypes = {
    channels: PropTypes.array.isRequired,
    currentChannel: PropTypes.number.isRequired,
    setMessages: PropTypes.func.isRequired
}

export default MessageComponent;