import React from "react"
import Banner from "./components/Banner"
import MessageWindow from "./components/MessageWindow"
import UserList from "./components/UserList"
import PendingTransfers from "./components/PendingTransfers"
import TransferStatus from "./components/TransferStatus"
import ChoicesContainer from "./components/ChoicesContainer"

import { ReactComponent as OtherIcon } from "./css/assets/other.svg"
import { ReactComponent as WifiIcon } from "./css/assets/netinterfaces/wifi.svg"
import { ReactComponent as EthernetIcon } from "./css/assets/netinterfaces/ethernet.svg"
import { ReactComponent as FileIcon } from "./css/assets/file.svg"
import { ReactComponent as MessageIcon } from "./css/assets/message.svg"

import { w3cwebsocket as WebSocketClient } from "websocket"
import _ from "lodash"

interface IProps { }

interface IState {
  showChoiceNetworkInterfaces: boolean,
  showCommChoice: boolean,
  showBanner: boolean,
  groups: Record<string, IUserMessages>,
  banner: {
    text: string,
    buttonText: string,
    backgroundColor: string,
    textColor: string
  },
  netInterfaces: Array<object>,
  currentTargetUser: string
}

class App extends React.Component<IProps, IState> {
  currentChoiceKey: number
  hostname: { value: string }
  os: { value: string }

  recvMsgSocket: WebSocketClient
  resourceSocket: WebSocketClient

  constructor(props: any) {
    super(props)

    this.state = {
      showChoiceNetworkInterfaces: false,
      showCommChoice: false,
      showBanner: false,
      groups: {},
      banner: {
        text: "Make sure multicast peer discovery is working on your device",
        buttonText: "Setup",
        backgroundColor: "#ff9100",
        textColor: "#ffffff",
      },
      netInterfaces: [],
      currentTargetUser: "",
    }

    this.displayChoiceNetworkInterfaces = this.displayChoiceNetworkInterfaces.bind(
      this
    )
    this.displayChoiceComm = this.displayChoiceComm.bind(this)
    this.addToGroup = this.addToGroup.bind(this)
    this.setCurrentTargetUser = this.setCurrentTargetUser.bind(this)
    this.onCommChosen = this.onCommChosen.bind(this)
    this.replyMessage = this.replyMessage.bind(this)
    this.chooseInterface = this.chooseInterface.bind(this)
    this.onRecvMessage = this.onRecvMessage.bind(this)
    this.setCollapsed = this.setCollapsed.bind(this)
    this.uniqueChoiceKey = this.uniqueChoiceKey.bind(this)

    //? Initialize variables
    this.currentChoiceKey = 0
    this.hostname = { value: "" }
    this.os = { value: "" }

    //? Initialize Websocket Connections
    this.recvMsgSocket = new WebSocketClient("ws://localhost:3000/recvMessage")
    this.recvMsgSocket.onopen = () => {
      console.log("Connected to message out.")
    }
    this.recvMsgSocket.onmessage = (message) => {
      if (typeof message.data === "string") {
        var messageObj = JSON.parse(message.data)
        this.onRecvMessage(messageObj.Message, messageObj.User)
      }
    }

    this.resourceSocket = new WebSocketClient("ws://localhost:3000/resource")
    this.resourceSocket.onopen = () => {
      console.log("Connected to resource.")
      this.resourceSocket.send(
        JSON.stringify({ name: "getHostname", parameters: {} })
      )
      this.resourceSocket.send(
        JSON.stringify({ name: "getOS", parameters: {} })
      )
      this.resourceSocket.send(
        JSON.stringify({ name: "requireSetup", parameters: {} })
      )
    }
    this.resourceSocket.onmessage = (message) => {
      if (typeof message.data === "string") {
        var messageObj = JSON.parse(message.data)
        console.log(messageObj)
        switch (messageObj.MsgType) {
          case "getInterfaces":
            this.setState({ netInterfaces: messageObj.Response.GetInterfaces })
            break
          case "getOS":
            this.os = { value: messageObj.Response.GetOS.toLowerCase() }
            break
          case "getHostname":
            this.hostname.value = messageObj.Response.GetHostname
            this.forceUpdate()
            break
          case "requireSetup":
            if (messageObj.Response.RequireSetup === true) {
              this.resourceSocket.send(
                JSON.stringify({ name: "getInterfaces", parameters: {} })
              )
            }
            this.setState({ showBanner: messageObj.Response.RequireSetup })
            break
          default:
            break
        }
      }
    }
  }

  uniqueChoiceKey(prefix: string) {
    this.currentChoiceKey++
    return prefix + this.currentChoiceKey.toString()
  }

  setCollapsed(user: string, opened: number) {
    var newGroups = _.cloneDeep(this.state.groups)
    newGroups[user].collapsed = opened
    this.setState({ groups: newGroups })
  }

  onRecvMessage(messageContent: string, user: string) {
    var newGroups = _.cloneDeep(this.state.groups)
    if (newGroups[user] !== undefined) {
      newGroups[user].messages.push({ content: messageContent, author: user })
    } else {
      newGroups[user] = {
        collapsed: -1,
        messages: [{ content: messageContent, author: user }],
      }
    }
    console.log(newGroups)
    this.setState({ groups: newGroups })
  }

  replyMessage(messageContent: string, destHost: string) {
    var newGroups = _.cloneDeep(this.state.groups)
    newGroups[destHost].messages.push({ content: messageContent, author: "You" })
    this.setState({ groups: newGroups })
    this.resourceSocket.send(
      JSON.stringify({
        name: "sendMessage",
        parameters: { MessageDestination: destHost, Message: messageContent },
      })
    )
  }

  setCurrentTargetUser(user: string) {
    this.setState({ currentTargetUser: user })
  }

  onCommChosen(type: string) {
    this.setState({ showCommChoice: false })
    if (type === "Message") {
      this.addToGroup([], this.state.currentTargetUser, -1)
    }
  }

  addToGroup(messages: Array<IMessage>, user: string, opened: number) {
    var newGroups = _.cloneDeep(this.state.groups)
    if (newGroups[user] === undefined) {
      newGroups[user] = { collapsed: opened, messages: messages }

      this.setState({ groups: newGroups })
    } else {
      this.setCollapsed(user, -1)
    }
  }

  displayChoiceNetworkInterfaces(show: boolean) {
    this.setState({ showChoiceNetworkInterfaces: show })
  }

  displayChoiceComm(show: boolean) {
    this.setState({ showCommChoice: show })
  }

  chooseInterface(intf: string) {
    if (intf !== undefined) {
      this.resourceSocket.send(
        JSON.stringify({
          name: "setInterfaces",
          parameters: { InterfaceID: parseInt(intf) },
        })
      )

      this.setState({
        showBanner: false,
        showChoiceNetworkInterfaces: false,
      })
    }
  }

  render() {
    return (
      <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
        <div className="AppDiv" id="AppGrid">
          <Banner
            show={this.state.showBanner}
            callback={() => {
              this.setState({ showChoiceNetworkInterfaces: true })
            }}
            closedCallback={() => {
              this.setState({ showBanner: false })
            }}
            text={this.state.banner.text}
            buttonText={this.state.banner.buttonText}
            backgroundColor={this.state.banner.backgroundColor}
            textColor={this.state.banner.textColor}
          />
          <MessageWindow
            groups={this.state.groups}
            submitMessage={this.replyMessage}
            setCollapsed={this.setCollapsed}
          />
          <div className="Col" style={{ overflow: "hidden" }}>
            <UserList
              hostname={this.hostname}
              displayCommChoice={this.displayChoiceComm}
              setCurrentTargetUser={this.setCurrentTargetUser}
            />
            <PendingTransfers />
            <TransferStatus />
          </div>
        </div>
        <ChoicesContainer
          show={this.state.showCommChoice}
          mainLabel="Choose what to send"
          icons={[MessageIcon, FileIcon]}
          items={[0, 1]}
          columns={2}
          chosenCallback={this.onCommChosen}
          labelLogic={(item: number) => {
            var result = { label: "", icon: OtherIcon }
            if (item === 0) {
              result.label = "Message"
              result.icon = MessageIcon
            } else if (item === 1) {
              result.label = "File"
              result.icon = FileIcon
            }
            return result
          }}
          componentID={this.uniqueChoiceKey("ChoiceContainer_")}
        />{" "}
        {/* CommChoice */}
        <ChoicesContainer
          show={this.state.showChoiceNetworkInterfaces}
          mainLabel="Choose a network interface to receive multicast"
          icons={[WifiIcon, EthernetIcon, OtherIcon]}
          items={this.state.netInterfaces}
          columns={6}
          chosenCallback={this.chooseInterface}
          // chosenCallback={() => {}}
          labelLogic={(item: INetInterface) => {
            var result = {
              label: `${item[1]} [${item[2]}]`,
              icon: OtherIcon,
              identifier: item[0],
            }
            if (item[1].includes("Wi-Fi") || item[1].includes("Wlan")) {
              result.icon = WifiIcon
            } else if (
              item.includes("Local Area Connection") ||
              item[1].includes("LAN") ||
              item[1].includes("Ethernet")
            ) {
              result.icon = EthernetIcon
            }
            return result
          }}
          componentID={this.uniqueChoiceKey("ChoiceContainer_")}
        />{" "}
        {/* NetInterfaceChoice */}
      </div>
    )
  }
}

export default App
