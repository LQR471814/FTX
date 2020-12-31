//? This component acts as a SINGLE message group containing a reply box and a bunch of messages

import React from "react";
import "../css/Window.css";
import "../css/MiniComponents.css";
import "../css/Root.css";
import PropTypes from "prop-types";
import Message from "./Message";

class MessageList extends React.Component {
  constructor(props) {
    super(props);

    this.groupContainerRef = React.createRef();
    this.messageGroupCollapsibleRef = React.createRef();
    this.msgInFieldRef = React.createRef();
    this.submitButtonRef = React.createRef();
    this.inputFieldRef = React.createRef();

    this.currentKey = 0;

    this.state = {
      msgIn: "",
      submitStyle: "SubmitButton",
    };

    this.onToggleCollapse = this.onToggleCollapse.bind(this);
    this.onCollapseFinish = this.onCollapseFinish.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubmitMessage = this.onSubmitMessage.bind(this);
    this.onButtonTransitionEnd = this.onButtonTransitionEnd.bind(this);
    this.showButton = this.showButton.bind(this);
    this.submit = this.submit.bind(this);
    this.release = this.release.bind(this);
    this.uniqueKey = this.uniqueKey.bind(this);

    this.inputFieldRef = React.createRef();
  }

  componentDidMount() {
    this.release(this.props.collapsed);
  }

  componentDidUpdate() {
    this.release(this.props.collapsed);
  }

  uniqueKey(prefix) {
    this.currentKey++;
    return prefix + this.currentKey.toString();
  }

  onChange(e) {
    this.setState({ msgIn: e.target.value });
    if (e.target.value !== "") {
      this.showButton(true);
    } else {
      this.showButton(false);
    }
  }

  showButton(show) {
    if (show === true) {
      this.submitButtonRef.current.style.margin = "0px 5px 0px 5px";
      this.submitButtonRef.current.style.padding = "10px 5px 10px 5px";
      this.submitButtonRef.current.style.maxWidth =
        this.submitButtonRef.current.scrollWidth.toString() + "px";
    } else {
      this.submitButtonRef.current.style.padding = "";
      this.submitButtonRef.current.style.margin = "";
      this.submitButtonRef.current.style.border = "";
      this.submitButtonRef.current.style.maxWidth = "0px";
    }
  }

  onToggleCollapse(e) {
    this.props.setCollapsed(this.props.user, this.props.collapsed * -1);
  }

  release(released) {
    if (released < 0) {
      this.groupContainerRef.current.style.background =
        "linear-gradient(180deg, rgba(40,40,40,0.6979166666666667) 0%, rgba(255,255,255,0) 35%)";
      this.groupContainerRef.current.style.maxHeight =
        this.groupContainerRef.current.scrollHeight.toString() + "px";
      this.groupContainerRef.current.style.height = "auto";
      this.messageGroupCollapsibleRef.current.style.borderRadius =
        "10px 10px 0px 0px";
      this.inputFieldRef.current.focus();
    } else {
      this.inputFieldRef.current.blur();
      this.groupContainerRef.current.style.maxHeight = "0px";
    }
  }

  onCollapseFinish(e) {
    if (this.groupContainerRef.current.style.maxHeight === "0px") {
      this.groupContainerRef.current.style.background = "none";
      this.messageGroupCollapsibleRef.style.borderRadius = "10px";
    }
  }

  onSubmitMessage(e) {
    if (e.key === "Enter") {
      this.submitButtonRef.current.style.backgroundColor = "#96fa60";
      this.submitButtonRef.current.style.border = "1px solid #ffffff";
      this.submit();
    }
  }

  onSubmit(e) {
    this.submit();
  }

  submit() {
    if (this.state.msgIn === "") {
      return;
    } else if (this.state.submitStyle === "SubmitButton Activated") {
      this.submitButtonRef.current.className = "SubmitButton";
      return;
    }
    this.submitButtonRef.current.className = "SubmitButton Activated";
    this.setState({ msgIn: "" });
    this.msgInFieldRef.current.value = "";

    this.props.submitMessage(this.state.msgIn, this.props.user);
  }

  onButtonTransitionEnd(e) {
    if (this.submitButtonRef.current.className === "SubmitButton Activated") {
      this.submitButtonRef.current.style.backgroundColor = "";
      this.submitButtonRef.current.style.border = "";
      this.submitButtonRef.current.className = "SubmitButton";
      this.showButton(false);
    }
  }

  render() {
    return (
      <div className="MessageList">
        <div
          className="MessageGroupCollapsible"
          onClick={this.onToggleCollapse}
        >
          <span className="MessageGroupUser">{this.props.user}</span>
        </div>
        <div
          className="MessageGroupContainer"
          onTransitionEnd={this.onCollapseFinish}
        >
          {this.props.messages.map((message) => {
            return (
              <Message
                key={this.uniqueKey("Message_")}
                text={message.content}
                author={message.author}
              />
            );
          })}
          <div className="Message">
            <p className="MessageAuthor">Reply</p>
            <div
              style={{
                margin: "10px 5px 5px 5px",
                display: "flex",
                overflow: "hidden",
              }}
            >
              <input
                tabIndex="-1"
                className="InputField"
                ref={this.inputFieldRef}
                placeholder="Message"
                onChange={this.onChange}
                onKeyDown={this.onSubmitMessage}
              />
              <div
                className={this.state.submitStyle}
                onClick={this.onSubmit}
                onTransitionEnd={this.onButtonTransitionEnd}
                style={{ display: "block" }}
              >
                <svg
                  height="12px"
                  width="30px"
                  viewBox="75 0 150 200"
                  transform="rotate(90 0 0)"
                  style={{ fill: "#4d4d4d" }}
                >
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
  setCollapsed: PropTypes.func.isRequired,
};

export default MessageList;
