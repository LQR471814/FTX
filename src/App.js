import React from 'react';
import SetupMulticastBanner from './components/SetupMulticastBanner';
import MessageWindow from './components/MessageWindow';
import UserList from './components/UserList';
import PendingTransfers from './components/PendingTransfers';
import TransferStatus from './components/TransferStatus';
import ChoicesContainer from './components/ChoicesContainer';
import { w3cwebsocket as WebSocketClient } from 'websocket';
import EmptyBanner from './components/EmptyBanner';
import { ReactComponent as OtherIcon } from './css/assets/other.svg'
import { ReactComponent as WifiIcon } from './css/assets/netinterfaces/wifi.svg'
import { ReactComponent as EthernetIcon } from './css/assets/netinterfaces/ethernet.svg'
import { ReactComponent as FileIcon } from './css/assets/file.svg';
import { ReactComponent as MessageIcon } from './css/assets/message.svg';
import _ from 'lodash';

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            showChoiceNetworkInterfaces: false,
            showCommChoice: false,
            showSetupBanner: false,
            groups: [
                {
                    user: "BOOO",
                    defaultCollapsed: true,
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
                    user: "BOOOA",
                    defaultCollapsed: true,
                    messages: [
                        {
                            content: "ABCDEFG",
                            author: "BOOO"
                        }
                    ]
                },
                {
                    user: "BOOOC",
                    defaultCollapsed: true,
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
                    user: "BOOOD",
                    defaultCollapsed: true,
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
            ],
            netInterfaces: [],
            currentTargetUser: undefined
        }

        this.displayChoiceNetworkInterfaces = this.displayChoiceNetworkInterfaces.bind(this)
        this.displayChoiceComm = this.displayChoiceComm.bind(this)
        this.showSetupBanner = this.showSetupBanner.bind(this)
        this.addToGroup = this.addToGroup.bind(this)
        this.setCurrentTargetUser = this.setCurrentTargetUser.bind(this)
        this.onCommChosen = this.onCommChosen.bind(this)
        this.replyMessage = this.replyMessage.bind(this)

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
                    this.setState({netInterfaces: messageObj.Response.GetInterfaces})
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
                    if (messageObj.Response.RequireSetup === true) {
                        this.props.resourceClient.send(JSON.stringify({name: "getInterfaces", parameters: {}}))
                    }
                    this.showSetupBanner(messageObj.Response.RequireSetup)
                    break;
                default:
                    break;
            }
        }
    }

    replyMessage(message, destHost) {
        this.resourceSocket.send(JSON.stringify({name: "sendMessage", parameters: {MessageDestination: destHost, Message: message}}))
    }

    getMessageGroupFromUser(user) {
        return this.state.groups.map((group) => {
            if (group.user === user) {
                return group
            }
            return undefined
        })
    }

    setCurrentTargetUser(user) {
        this.setState({currentTargetUser: user})
    }

    onCommChosen(type) {
        this.setState({showCommChoice: false})
        if (type === "Message") {
            this.addToGroup([], this.state.currentTargetUser, true)
        }
    }

    addToGroup(messages, user, opened) {
        var newGroups = _.cloneDeep(this.state.groups)
        var newGrp = {user: user, defaultCollapsed: !opened, messages: messages}
        newGroups.push(newGrp)

        this.setState({groups: newGroups})
    }

    displayChoiceNetworkInterfaces(show) {
        this.setState({showChoiceNetworkInterfaces: show})
    }

    displayChoiceComm(show) {
        this.setState({showCommChoice: show})
    }

    showSetupBanner(show) {
        if (show === false) {
            document.getElementById("AppGrid").style.gridTemplateRows = "auto";
        } else {
            document.getElementById("AppGrid").style.gridTemplateRows = "45px auto"
        }
        this.setState({showSetupBanner: show})
    }

    chooseInterface(intf) {
        this.resourceSocket.send(JSON.stringify({name: "setInterfaces", parameters: {InterfaceID: parseInt(intf[0])}}))
    }

    render() {
        return (
            <div style={{height: "100vh", width: "100vw", overflow: "hidden"}}>
                <div className="AppDiv" id="AppGrid" style={{gridTemplateRows: "auto"}}>
                    {this.state.showSetupBanner && <this.setupBanner displayChoiceNetworkInterfaces={this.displayChoiceNetworkInterfaces} />}
                    <MessageWindow ref={this.MessageWindowRef} groups={this.state.groups} submitMessage={this.replyMessage} />
                    <div className="Col" style={{overflow: "hidden"}}>
                        <UserList hostname={this.hostname} displayCommChoice={this.displayChoiceComm} setCurrentTargetUser={this.setCurrentTargetUser} />
                        <PendingTransfers />
                        <TransferStatus />
                    </div>
                </div>

                <ChoicesContainer show={this.state.showCommChoice} icons={[MessageIcon, FileIcon]} items={[0, 1]} columns={2} chosenCallback={this.onCommChosen} labelLogic={ (item) => {
                        var result = {label: "", icon: OtherIcon}
                        if (item === 0) {
                            result.label = "Message"
                            result.icon = MessageIcon
                        } else if (item === 1) {
                            result.label = "File"
                            result.icon = FileIcon
                        }
                        return result
                    } } /> {/* CommChoice */}
                <ChoicesContainer show={this.state.showChoiceNetworkInterfaces} icons={[WifiIcon, EthernetIcon, OtherIcon]} items={this.state.netInterfaces} columns={6} chosenCallback={this.chooseInterface} labelLogic={ (item) => {
                        var result = {label: "", icon: OtherIcon}
                        if (item[1].includes("Wi-Fi") || item[1].includes("Wlan")) {
                            this.interfaceLogo = WifiIcon
                        } else if (item[1].includes("Local Area Connection") || item[1].includes("LAN") || item[1].includes("Ethernet")) {
                            this.interfaceLogo = EthernetIcon
                        }
                        return result
                    } } /> {/* NetInterfaceChoice */}
            </div>
        )
    }
}

export default App;