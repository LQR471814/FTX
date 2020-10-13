import React from 'react';
import SetupMulticastBanner from './components/SetupMulticastBanner';
import MessageWindow from './components/MessageWindow';
import UserList from './components/UserList';
import PendingTransfers from './components/PendingTransfers';
import TransferStatus from './components/TransferStatus';
import NetInterfaceChoice from './components/NetInterfaceChoice'
import { w3cwebsocket as WebSocketClient } from 'websocket';
import EmptyBanner from './components/EmptyBanner';
import CommChoice from './components/CommChoice';
import _ from 'lodash';

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            showChoiceNetworkInterfaces: false,
            showSetupBanner: false,
            groups: [
                {
                    user: "BOOO",
                    messages: [
                        {
                            content: "ABCDEFG",
                            author: "BOOO"
                        },
                        {
                            content: "ABCDEFG",
                            author: "BOOO"
                        },
                        {
                            content: "ABCDEFG",
                            author: "BOOO"
                        }
                    ]
                },
                {
                    user: "BOOO",
                    messages: [
                        {
                            content: "ABCDEFG",
                            author: "BOOO"
                        }
                    ]
                },
                {
                    user: "BOOO",
                    messages: [
                        {
                            content: "ABCDEFG",
                            author: "BOOO"
                        },
                        {
                            content: "ABCDEFG",
                            author: "BOOO"
                        },
                        {
                            content: "ABCDEFG",
                            author: "BOOO"
                        },
                        {
                            content: "ABCDEFG",
                            author: "BOOO"
                        },
                        {
                            content: "ABCDEFG",
                            author: "BOOO"
                        },
                        {
                            content: "ABCDEFG",
                            author: "BOOO"
                        }
                    ]
                },
                {
                    user: "BOOO",
                    messages: [
                        {
                            content: "ABCDEFG",
                            author: "BOOO"
                        },
                        {
                            content: "ABCDEFG",
                            author: "BOOO"
                        },
                        {
                            content: "ABCDEFG",
                            author: "BOOO"
                        },
                        {
                            content: "ABCDEFG",
                            author: "BOOO"
                        },
                        {
                            content: "ABCDEFG",
                            author: "BOOO"
                        },
                        {
                            content: "ABCDEFG",
                            author: "BOOO"
                        }
                    ]
                }
            ]
        }

        this.displayChoiceNetworkInterfaces = this.displayChoiceNetworkInterfaces.bind(this)
        this.showSetupBanner = this.showSetupBanner.bind(this)
        this.addToGroup = this.addToGroup.bind(this)

        this.setupBanner = EmptyBanner
        this.hostname = {value: undefined}

        this.resourceSocket = new WebSocketClient("ws://localhost:3000/resource")
        this.resourceSocket.onopen = () => {
            console.log("Connected to resource.")
            this.resourceSocket.send(JSON.stringify({name: "getHostname", parameters: {}}))
            this.resourceSocket.send(JSON.stringify({name: "getOS", parameters: {}}))
        }
        this.resourceSocket.onmessage = (message) => {
            var messageObj = JSON.parse(message.data);
            console.log(messageObj)
            switch (messageObj.MsgType) {
                case "getInterfaces":
                    this.NetInterfaceChoiceElement.current.setInterfaces(messageObj.Response.GetInterfaces)
                    break;
                case "getOS":
                    this.os = {value: messageObj.Response.GetOS.toLowerCase()}
                    this.setupBanner = SetupMulticastBanner
                    this.resourceSocket.send(JSON.stringify({name: "requireSetup", parameters: {}}))
                    break;
                case "getHostname":
                    this.hostname.value = messageObj.Response.GetHostname
                    this.forceUpdate()
                    break;
                case "requireSetup":
                    this.showSetupBanner(messageObj.Response.RequireSetup)
                    break;
                default:
                    break;
            }
        }

        this.NetInterfaceChoiceElement = React.createRef();
        this.CommChoiceElement = React.createRef();
        this.MessageWindowRef = React.createRef();
    }

    addToGroup(messages, user, opened) {
        if (this.MessageWindowRef.current !== null) {
            this.setState({
                groups: _.cloneDeep(this.state.groups).push({user: user, messages: messages})
            })

            if (opened === true) {
                this.MessageWindowRef.current.sendFocus(1, user)
            } else {
                this.MessageWindowRef.current.sendFocus(0, user)
            }
        }
    }

    displayChoiceNetworkInterfaces(show) {
        this.setState({showChoiceNetworkInterfaces: show})
    }

    showSetupBanner(show) {
        if (show === false) {
            document.getElementById("AppGrid").style.gridTemplateRows = "auto";
        } else {
            document.getElementById("AppGrid").style.gridTemplateRows = "45px auto"
        }
        this.setState({showSetupBanner: show})
    }

    render() {
        return (
            <div style={{height: "100vh", width: "100vw", overflow: "hidden"}}>
                <div className="AppDiv" id="AppGrid" style={{gridTemplateRows: "auto"}}>
                    {this.state.showSetupBanner && <this.setupBanner displayChoiceNetworkInterfaces={this.displayChoiceNetworkInterfaces} />}
                    <MessageWindow ref={this.MessageWindowRef} groups={this.state.groups} />
                    <div className="Col" style={{overflow: "hidden"}}>
                        <UserList hostname={this.hostname} commChoice={this.CommChoiceElement} />
                        <PendingTransfers />
                        <TransferStatus />
                    </div>
                </div>
                <CommChoice ref={this.CommChoiceElement} resourceClient={this.resourceSocket} addToGroup={this.addToGroup} />
                {this.state.showChoiceNetworkInterfaces && (<NetInterfaceChoice ref={this.NetInterfaceChoiceElement} resourceClient={this.resourceSocket} />)}
            </div>
        )
    }
}

export default App;