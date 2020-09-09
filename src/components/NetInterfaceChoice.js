import React from 'react';
import PropTypes from 'prop-types';
import '../css/MiniComponents.css';
import '../css/ChoiceOverlay.css';
import NetInterface from './NetInterface';
import uniqid from 'uniqid';

class NetInterfaceChoice extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            interfaces: []
        }

        this.setInterfaces = this.setInterfaces.bind(this)
        
        this.props.resourceClient.send(JSON.stringify({name: "getInterfaces", parameters: {}}))
    }

    componentDidUpdate() {
        document.getElementById("NetInterfaceChoiceContainer").style.columnGap = "70px"
    }
    
    setInterfaces(interfaces) {
        this.setState({interfaces: interfaces})
        document.getElementById("AppGrid").style.transition = "none"
        document.getElementById("AppGrid").style.filter = "blur(4px)"
    }

    closeChoice() {
        if (document.getElementById("NetInterfaceChoiceContainer").className === "ChoiceContainer Close") {
            document.getElementById("AppGrid").style.transition = "all 0.25s"
            document.getElementById("AppGrid").style.filter = "none"
            document.getElementById("NetInterfaceChoiceContainer").style.display = "none"
        }
    }

    render() {
        return (
            <div className="ChoiceContainer" id="NetInterfaceChoiceContainer" onTransitionEnd={this.closeChoice}>
                <span className="Info">Choose a network interface to receive multicast</span>
                {this.state.interfaces.map((netInterface)=>{
                    return <NetInterface key={uniqid()} interface={netInterface} resourceClient={this.props.resourceClient} />
                })}
            </div>
        );
    }
}

NetInterfaceChoice.propTypes = {
    resourceClient: PropTypes.object.isRequired
}

export default NetInterfaceChoice;