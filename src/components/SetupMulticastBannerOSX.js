import React from 'react';
import '../css/SetupMulticastBanner.css'
import { ReactComponent as CloseIcon } from '../css/assets/close.svg';

class SetupMulticastBannerOSX extends React.Component {
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
                <span>Make sure device discovery is working on your device, go to system preferences, sharing and check "File Sharing"</span>
                <button onClick={this.onClickClose} className="CloseButton"><CloseIcon /></button>
            </div>
        );
    }
}

export default SetupMulticastBannerOSX;