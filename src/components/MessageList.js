//? This component acts as a SINGLE message group containing a reply box and a bunch of messages

import React from 'react';
import '../css/Window.css';
import '../css/MiniComponents.css';
import '../css/RootStyle.css';
import uniqid from 'uniqid';
import PropTypes from 'prop-types';
import Message from './Message';

class MessageList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            groupContainerID: uniqid(),
            messageGroupCollapsibleID: uniqid(),
            msgInFieldID: uniqid(),
            submitButtonID: uniqid(),
            inputFieldID: uniqid(),
            msgIn:"",
            submitStyle:"SubmitButton"
        }

        this.onToggleCollapse = this.onToggleCollapse.bind(this)
        this.onCollapseFinish = this.onCollapseFinish.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onSubmitMessage = this.onSubmitMessage.bind(this)
        this.onButtonTransitionEnd = this.onButtonTransitionEnd.bind(this)
        this.showButton = this.showButton.bind(this)
        this.submit = this.submit.bind(this)
        this.release = this.release.bind(this)

        this.inputFieldRef = React.createRef()
    }

    componentDidMount() {
        this.release(this.props.collapsed)
    }

    componentDidUpdate() {
        this.release(this.props.collapsed)
    }

    onChange(e) {
        this.setState({msgIn: e.target.value})
        if (e.target.value !== "") {
            this.showButton(true)
        } else {
            this.showButton(false)
        }
    }

    showButton(show) {
        if (show === true) {
            document.getElementById(this.state.submitButtonID).style.margin = "0px 5px 0px 5px"
            document.getElementById(this.state.submitButtonID).style.padding = "10px 5px 10px 5px"
            document.getElementById(this.state.submitButtonID).style.maxWidth = document.getElementById(this.state.submitButtonID).scrollWidth.toString() + "px"
        } else {
            document.getElementById(this.state.submitButtonID).style.padding = ""
            document.getElementById(this.state.submitButtonID).style.margin = ""
            document.getElementById(this.state.submitButtonID).style.border = ""
            document.getElementById(this.state.submitButtonID).style.maxWidth = "0px"
        }
    }

    onToggleCollapse(e) {
        this.props.setCollapsed(this.props.user, this.props.collapsed * -1)
    }

    release(released) {
        if (released < 0) {
            document.getElementById(this.state.groupContainerID).style.background = "linear-gradient(180deg, rgba(40,40,40,0.6979166666666667) 0%, rgba(255,255,255,0) 35%)"
            document.getElementById(this.state.groupContainerID).style.maxHeight = document.getElementById(this.state.groupContainerID).scrollHeight.toString() + "px"
            document.getElementById(this.state.groupContainerID).style.height = "auto"
            document.getElementById(this.state.messageGroupCollapsibleID).style.borderRadius = "10px 10px 0px 0px"
            this.inputFieldRef.current.focus()
        } else {
            this.inputFieldRef.current.blur()
            document.getElementById(this.state.groupContainerID).style.maxHeight = "0px"
        }
    }

    onCollapseFinish(e) {
        if (document.getElementById(this.state.groupContainerID).style.maxHeight === "0px") {
            document.getElementById(this.state.groupContainerID).style.background = "none"
            document.getElementById(this.state.messageGroupCollapsibleID).style.borderRadius = "10px"
        }
    }

    onSubmitMessage(e) {
        if (e.key === "Enter") {
            document.getElementById(this.state.submitButtonID).style.backgroundColor = "#96fa60"
            document.getElementById(this.state.submitButtonID).style.border = "1px solid #ffffff"
            this.submit()
        }
    }

    onSubmit(e) {
        this.submit()
    }

    submit() {
        if (this.state.msgIn === "") {
            return
        } else if (this.state.submitStyle === "SubmitButton Activated") {
            document.getElementById(this.state.submitButtonID).className = "SubmitButton"
            return
        }
        document.getElementById(this.state.submitButtonID).className = "SubmitButton Activated"
        this.setState({msgIn:""})
        document.getElementById(this.state.msgInFieldID).value = ""

        this.props.submitMessage(this.state.msgIn, this.props.user)
    }

    onButtonTransitionEnd(e) {
        if (document.getElementById(this.state.submitButtonID).className === "SubmitButton Activated") {
            document.getElementById(this.state.submitButtonID).style.backgroundColor = ""
            document.getElementById(this.state.submitButtonID).style.border = ""
            document.getElementById(this.state.submitButtonID).className = "SubmitButton"
            this.showButton(false)
        }
    }

    render() {
        return (
            <div className="MessageList">
                <div className="MessageGroupCollapsible" id={this.state.messageGroupCollapsibleID} onClick={this.onToggleCollapse}>
                    <span className="MessageGroupUser">{this.props.user}</span>
                </div>
                <div className="MessageGroupContainer" id={this.state.groupContainerID} onTransitionEnd={this.onCollapseFinish}>
                    { this.props.messages.map((message)=>{
                        return <Message key={ uniqid() } text={ message.content } author={ message.author } />
                    }) }
                    <div className="Message">
                        <p className="MessageAuthor" id={this.state.inputFieldID}>Reply</p>
                        <div style={{margin: "10px 5px 5px 5px", display: "flex", overflow: "hidden"}}>
                            <input tabIndex="-1" className="InputField" ref={this.inputFieldRef} id={this.state.msgInFieldID} placeholder="Message" onChange={this.onChange} onKeyDown={this.onSubmitMessage} />
                            <div className={this.state.submitStyle} id={this.state.submitButtonID} onClick={this.onSubmit} onTransitionEnd={this.onButtonTransitionEnd} style={{display: "block"}}>
                                <svg height="12px" width="30px" viewBox="75 0 150 200" transform="rotate(90 0 0)" style={{fill: "#4d4d4d"}}>
                                    <path d="M150 0 L75 200 L225 200 Z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

MessageList.propTypes = {
    collapsed: PropTypes.number.isRequired,
    messages: PropTypes.array.isRequired,
    user: PropTypes.string.isRequired,
    submitMessage: PropTypes.func.isRequired,
    setCollapsed: PropTypes.func.isRequired
}

export default MessageList;