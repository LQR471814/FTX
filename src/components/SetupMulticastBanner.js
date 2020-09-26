import React from 'react';
import '../css/SetupMulticastBanner.css'
import { ReactComponent as CloseIcon } from '../css/assets/close.svg';
import PropTypes from 'prop-types';

class SetupMulticastBanner extends React.Component {
    constructor(props) {
        super(props)

        this.onClickClose = this.onClickClose.bind(this);
        this.onClickSetup = this.onClickSetup.bind(this);

        this.state = {display:"flex"}
    }

    onClickClose(e) {
        this.setState({display:"none"})
        document.getElementById("AppGrid").style.gridTemplateRows = "auto";
    }

    onClickSetup(e) {
        this.setState({display:"none"})
        document.getElementById("AppGrid").style.gridTemplateRows = "auto";

        this.props.displayChoiceNetworkInterfaces(true)
    }

    render() {
        return (
            <div className="BannerContainer" style={{display: this.state.display}}>
                <div style={{flex: "1", justifyContent: "center"}}>
                    <span>Make sure device discovery is working on your device</span>
                    <button className="SetupButton" onClick={this.onClickSetup}>Setup</button>
                </div>
                <button onClick={this.onClickClose} className="CloseButton"><CloseIcon /></button>
            </div>
        );
    }
}

SetupMulticastBanner.propTypes = {
    displayChoiceNetworkInterfaces: PropTypes.func.isRequired
}

export default SetupMulticastBanner;