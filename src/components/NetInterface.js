import React from 'react';
import PropTypes from 'prop-types';
import '../css/MiniComponents.css';
import '../css/ChoiceOverlay.css';
import '../css/Choice.css';
import { ReactComponent as other } from '../css/assets/other.svg'
import { ReactComponent as wifi } from '../css/assets/netinterfaces/wifi.svg'
import { ReactComponent as ethernet } from '../css/assets/netinterfaces/ethernet.svg'

class NetInterface extends React.Component {
    constructor(props) {
        super(props)

        if (this.props.interface[1].includes("Wi-Fi") || this.props.interface[1].includes("Wlan")) {
            this.interfaceLogo = wifi
        } else if (this.props.interface[1].includes("Local Area Connection") || this.props.interface[1].includes("LAN") || this.props.interface[1].includes("Ethernet")) {
            this.interfaceLogo = ethernet
        } else {
            this.interfaceLogo = other
        }

        this.chooseInterface = this.chooseInterface.bind(this)
    }

    setInterfaces(interfaces) {
        this.setState({interfaces: interfaces})
    }

    chooseInterface() {
        document.getElementById("NetInterfaceChoiceContainer").className = "ChoiceContainer Close"
        document.getElementById("NetInterfaceChoiceContainer").style.columnGap = "140px"
        this.props.resourceClient.send(JSON.stringify({name: "setInterfaces", parameters: {InterfaceID: parseInt(this.props.interface[0])}}))
    }

    render() {
        return (
            <div className="ChoiceDiv" onClick={this.chooseInterface}>
                <this.interfaceLogo />
                <p className="Tag">{this.props.interface[1]}</p>
            </div>
        );
    }
}

NetInterface.propTypes = {
    interface: PropTypes.object.isRequired,
    resourceClient: PropTypes.object.isRequired
}

export default NetInterface;