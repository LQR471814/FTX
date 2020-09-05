import React from 'react';
import '../css/SetupMulticastBanner.css'
import PropTypes from 'prop-types';
import { ReactComponent as CloseIcon } from '../css/assets/close.svg';

class SetupMulticastBanner extends React.Component {
    constructor(props) {
        super(props)

        this.onClickClose = this.onClickClose.bind(this);
        
        this.state = {display:"flex"}
    }

    onClickClose(e) {
        this.setState({display:"none"})
        document.getElementById("AppGrid").style.gridTemplateRows = "auto";
    }
    
    render() {
        return (
            <div className="BannerContainer" style={{display: this.state.display}}>
                <div style={{flex: "1", justifyContent: "center"}}>
                    <span>Make sure device discovery is working on your device</span>
                    <button className="SetupButton">Setup</button>
                </div>
                <button onClick={this.onClickClose} className="CloseButton"><CloseIcon /></button>
            </div>
        );
    }
}

SetupMulticastBanner.propTypes = {
    commSocket: PropTypes.object.isRequired
}

export default SetupMulticastBanner;