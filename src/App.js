import React from 'react';
import SetupMulticastBannerWin from './components/SetupMulticastBannerWin';
import SetupMulticastBannerOSX from './components/SetupMulticastBannerOSX';
import MessageComponentContainer from './components/containers/MessageComponentContainer';
import UserList from './components/UserList';
import PendingTransfers from './components/PendingTransfers';
import TransferStatus from './components/TransferStatus';
import NetInterfaceChoice from './components/NetInterfaceChoice'
import { w3cwebsocket as WebSocketClient } from 'websocket';
import EmptyBanner from './components/EmptyBanner';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showChoiceNetworkInterfaces: false,
            showSetupBanner: true
        }
        
        this.displayChoiceNetworkInterfaces = this.displayChoiceNetworkInterfaces.bind(this)
        this.showSetupBanner = this.showSetupBanner.bind(this)

        this.setupBanner = EmptyBanner

        this.resourceSocket = new WebSocketClient("ws://localhost:4000")
        this.resourceSocket.onopen = () => {
            console.log("Connected to resource.")
            this.resourceSocket.send(JSON.stringify({name: "getHostname", parameters: {}}))
            this.resourceSocket.send(JSON.stringify({name: "getOS", parameters: {}}))
        }
        this.resourceSocket.onmessage = (message) => {
            var messageObj = JSON.parse(message.data);
            console.log(messageObj)
            switch (messageObj.type) {
                case "getInterfaces":
                    this.NetInterfaceChoiceElement.current.setInterfaces(JSON.parse(messageObj.response))
                    break;
                case "setInterfaces":
                    console.log(messageObj.response)
                    break;
                case "getOS":
                    this.os = {value: messageObj.response}
                    if (this.os.value === "Windows") {
                        this.setupBanner = SetupMulticastBannerWin
                        this.forceUpdate()
                    } else if (this.os === "Darwin") {
                        this.setupBanner = SetupMulticastBannerOSX
                        this.forceUpdate()
                    }
                    break;
                case "getHostname":
                    this.hostname = {value: messageObj.response}
                default:
                    break;
            }
        }

        this.NetInterfaceChoiceElement = React.createRef();
    }

    displayChoiceNetworkInterfaces(show) {
        this.setState({showChoiceNetworkInterfaces: show})
    }

    showSetupBanner(show) {
        if (show === false) {
            document.getElementById("AppGrid").style.gridTemplateRows = "auto";
        }
        this.setState({showSetupBanner: show})
    }

    render() {
        return (
            <div style={{height: "100%"}}>
                <div className="AppDiv" id="AppGrid">
                    {this.state.showSetupBanner && <this.setupBanner displayChoiceNetworkInterfaces={this.displayChoiceNetworkInterfaces} />}
                    <MessageComponentContainer />
                    <div className="Col" style={{overflow: "hidden"}}>
                        <UserList hostname={this.hostname} showSetupBanner={this.showSetupBanner} />
                        <PendingTransfers />
                        <TransferStatus />
                    </div>
                </div>
                {this.state.showChoiceNetworkInterfaces && (<NetInterfaceChoice ref={this.NetInterfaceChoiceElement} resourceClient={this.resourceSocket} />)}
            </div>
        )
    }
}

export default App;