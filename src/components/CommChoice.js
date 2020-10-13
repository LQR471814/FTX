import React from 'react';
import Comm from './Comm';
import PropTypes from 'prop-types';

class CommChoice extends React.Component {
    constructor(props) {
        super(props)

        this.userInfo = {name: "", ip: "0.0.0.0"}

        this.chosen = this.chosen.bind(this)
    }

    async show(userInfo) {
        this.userInfo = userInfo
        document.getElementById("AppGrid").style.transition = "none"
        document.getElementById("AppGrid").style.filter = "blur(4px)"
        document.getElementById("CommChoiceContainer").style.display = "grid"
        await new Promise(r => setTimeout(r, 50));
        document.getElementById("CommChoiceContainer").style.columnGap = "300px"
    }

    chosen(type) {
        if (type === 0) {
            this.props.addToGroup([], this.userInfo.name, true)
            // this.props.resourceClient.send(JSON.stringify({name: "sendMessage", parameters: {MessageDestination: this.userInfo.ip}}))
        }
    }

    async close() {
        if (document.getElementById("CommChoiceContainer").className === "ChoiceContainer Close") {
            document.getElementById("AppGrid").style.transition = "all 0.25s"
            document.getElementById("AppGrid").style.filter = "none"
            document.getElementById("CommChoiceContainer").style.columnGap = "500px"
            await new Promise(r => setTimeout(r, parseInt(document.getElementById("CommChoiceContainer").style.transitionDelay, 10) * 1000));
            document.getElementById("CommChoiceContainer").style.display = "none"
        }
    }

    render() {
        return (
            <div className="ChoiceContainer" id="CommChoiceContainer" style={{display: "none", gridTemplateColumns: "repeat(2, 1fr)", width: "30%"}}>
                <span className="Info">What will be sent?</span>
                <Comm commType={0} callbackChoice={this.chosen} />
                <Comm commType={1} callbackChoice={this.chosen} />
            </div>
        )
    }
}

CommChoice.propTypes = {
    resourceClient: PropTypes.object.isRequired,
    addToGroup: PropTypes.func.isRequired
}

export default CommChoice;