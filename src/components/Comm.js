import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as FileIcon } from '../css/assets/file.svg';
import { ReactComponent as MessageIcon } from '../css/assets/message.svg';
import { ReactComponent as Other } from '../css/assets/other.svg';

class Comm extends React.Component {
    constructor(props) {
        super(props)
        this.commIcon = Other
        this.caption = ""
        if (this.props.commType === 0) {
            this.commIcon = MessageIcon
            this.caption = "Message"
        } else if (this.props.commType === 1) {
            this.commIcon = FileIcon
            this.caption = "File"
        }
    }

    render() {
        return (
            <div onClick={this.props.callbackChoice(this.props.commType)} className="ChoiceDiv">
                <this.commIcon height="100px" width="100px" />
                <p className="Tag">{this.caption}</p>
            </div>
        )
    }
}

Comm.propTypes = {
    commType: PropTypes.number.isRequired, //? Format - 0: Message, 1: Send File
    callbackChoice: PropTypes.func.isRequired
}

export default Comm;