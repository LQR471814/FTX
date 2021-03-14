import React from "react"
import Banner from "components/Banner/Banner"
import Window from "components/Window/Window"
import MessageComponent from "components/MessagePanel/MessageComponent"
import UserList from "components/UserList/UserList"
import ChoicesContainer from "components/Choice/ChoicesContainer"

import { ReactComponent as OtherIcon } from "styling/assets/other.svg"
import { ReactComponent as WifiIcon } from "styling/assets/interfaceLogos/wifi.svg"
import { ReactComponent as EthernetIcon } from "styling/assets/interfaceLogos/ethernet.svg"
import { ReactComponent as FileIcon } from "styling/assets/file.svg"
import { ReactComponent as MessageIcon } from "styling/assets/message.svg"

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
}

class App extends React.Component<IProps, IState> {
  currentTargetUser: string
  currentChoiceKey: number
  hostname: string
  os: string

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
    this.hostname = ""
    this.os = ""
    this.currentTargetUser = ""

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
            this.os = messageObj.Response.GetOS.toLowerCase()
            break

          case "getHostname":
            this.hostname = messageObj.Response.GetHostname
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
    this.currentTargetUser = user
  }

  onCommChosen(type: string) {
    this.setState({ showCommChoice: false })
    if (type === "Message") {
      this.addToGroup([], this.currentTargetUser, -1)
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

          <div className="Col" style={{ overflow: "hidden" }}>
            <Window height="100%" title="Messages">
              <MessageComponent
                groups={this.state.groups}
                submitMessage={this.replyMessage}
                setCollapsed={this.setCollapsed}
              />
            </Window>
          </div>

          <div className="Col" style={{ overflow: "hidden" }}>
            <Window height="40%" title="User List">
              <UserList
                hostname={this.hostname}
                displayCommChoice={this.displayChoiceComm}
                setCurrentTargetUser={this.setCurrentTargetUser}
              />
            </Window>
            <Window height="30%" title="Pending Transfers"></Window>
            <Window height="30%" title="Transfer Status"></Window>
          </div>

        </div>

        {/* <div className="UploadFileArea">
          <form>
            <p>Upload multiple files with the file dialog or by dragging and dropping images onto the dashed region</p>
            <input type="file" id="fileElem" multiple accept="image/*" />
            <label className="button" for="fileElem">Select some files</label>
          </form>
        </div> */}
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
        />
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
        />
        {/* NetInterfaceChoice */}

      </div>
    )
  }
}

export default App
