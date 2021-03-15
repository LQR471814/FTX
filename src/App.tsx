import React, { useRef, useState } from "react"
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

export default function App() {
  const [showChoiceNetworkInterfaces, setShowChoiceNetworkInterfaces] = useState(false)
  const [showCommChoice, setShowCommChoice] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [groups, setGroups] = useState({} as Record<string, IMessageGroup>)
  const [banner] = useState(
    {
      text: "Make sure multicast peer discovery is working on your device",
      buttonText: "Setup",
      backgroundColor: "#ff9100",
      textColor: "#ffffff",
    }
  )
  const [netInterfaces, setNetInterfaces] = useState([])
  const [hostname, setHostname] = useState("")

  //? Initialize variables
  const currentChoiceKey = useRef(0)
  const currentTargetUser = useRef("")

  //? Initialize Websocket Connections
  const recvMsgSocket = new WebSocketClient("ws://localhost:3000/recvMessage")
  recvMsgSocket.onopen = () => {
    console.log("Connected to message out.")
  }
  recvMsgSocket.onmessage = (message) => {
    if (typeof message.data === "string") {
      let messageObj = JSON.parse(message.data)
      onRecvMessage(messageObj.Message, messageObj.User)
    }
  }

  const resourceSocket = new WebSocketClient("ws://localhost:3000/resource")
  resourceSocket.onopen = () => {
    console.log("Connected to resource.")

    resourceSocket.send(
      JSON.stringify({ name: "getHostname", parameters: {} })
    )
    // resourceSocket.send( //? Unnecessary
    //   JSON.stringify({ name: "getOS", parameters: {} })
    // )
    resourceSocket.send(
      JSON.stringify({ name: "requireSetup", parameters: {} })
    )
  }

  resourceSocket.onmessage = (message) => {
    if (typeof message.data === "string") {
      let messageObj = JSON.parse(message.data)
      console.log(messageObj)
      switch (messageObj.MsgType) {
        case "getInterfaces":
          setNetInterfaces(messageObj.Response.GetInterfaces)
          break

        // case "getOS": //? Unnecessary
        //   os = messageObj.Response.GetOS.toLowerCase()
        //   break

        case "getHostname":
          setHostname(messageObj.Response.GetHostname)
          break

        case "requireSetup":
          if (messageObj.Response.RequireSetup === true) {
            resourceSocket.send(
              JSON.stringify({ name: "getInterfaces", parameters: {} })
            )
          }
          setShowBanner(messageObj.Response.RequireSetup)
          break

        default:
          break
      }
    }
  }

  const uniqueChoiceKey = (prefix: string) => {
    currentChoiceKey.current++
    return prefix + currentChoiceKey.current.toString()
  }

  const setCollapsed = (user: string, opened: number) => {
    const newGroups = _.cloneDeep(groups)
    newGroups[user].collapsed = opened
    setGroups(newGroups)
  }

  const onRecvMessage = (messageContent: string, user: string) => {
    const newGroups = _.cloneDeep(groups)
    if (newGroups[user] !== undefined) {
      newGroups[user].messages.push({ content: messageContent, author: user })
    } else {
      newGroups[user] = {
        collapsed: -1,
        messages: [{ content: messageContent, author: user }],
      }
    }
    console.log(newGroups)
    setGroups(newGroups)
  }

  const replyMessage = (messageContent: string, destHost: string) => {
    const newGroups = _.cloneDeep(groups)
    newGroups[destHost].messages.push({ content: messageContent, author: "You" })
    setGroups(newGroups)
    resourceSocket.send(
      JSON.stringify({
        name: "sendMessage",
        parameters: { MessageDestination: destHost, Message: messageContent },
      })
    )
  }

  const setCurrentTargetUser = (user: string) => {
    currentTargetUser.current = user
  }

  const onCommChosen = (type: string) => {
    setShowCommChoice(false)
    if (type === "Message") {
      addToGroup([], currentTargetUser.current, -1)
    }
  }

  const addToGroup = (initMessages: IMessage[], user: string, opened: number) => {
    const newGroups = _.cloneDeep(groups)
    if (newGroups[user] === undefined) {
      newGroups[user] = { messages: initMessages, collapsed: opened }
      setGroups(newGroups)
    } else {
      setCollapsed(user, -1)
    }
  }

  const chooseInterface = (intf: string) => {
    if (intf !== undefined) {
      resourceSocket.send(
        JSON.stringify({
          name: "setInterfaces",
          parameters: { InterfaceID: parseInt(intf) },
        })
      )

      setShowBanner(false)
      setShowChoiceNetworkInterfaces(false)
    }
  }

  return (

    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <div className="AppDiv" id="AppGrid">
        <Banner
          show={showBanner}
          callback={() => {
            setShowChoiceNetworkInterfaces(true)
          }}
          closedCallback={() => {
            setShowBanner(false)
          }}
          text={banner.text}
          buttonText={banner.buttonText}
          backgroundColor={banner.backgroundColor}
          textColor={banner.textColor}
        />

        <div className="Col" style={{ overflow: "hidden" }}>
          <Window height="100%" title="Messages">
            <MessageComponent
              groups={groups}
              submitMessage={replyMessage}
              setCollapsed={setCollapsed}
            />
          </Window>
        </div>

        <div className="Col" style={{ overflow: "hidden" }}>
          <Window height="40%" title="User List">
            <UserList
              hostname={hostname}
              displayCommChoice={setShowCommChoice}
              setCurrentTargetUser={setCurrentTargetUser}
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
        show={showCommChoice}
        mainLabel="Choose what to send"
        icons={[MessageIcon, FileIcon]}
        items={[0, 1]}
        columns={2}
        chosenCallback={onCommChosen}
        labelLogic={(item: number) => {
          let result = { label: "", icon: OtherIcon }
          if (item === 0) {
            result.label = "Message"
            result.icon = MessageIcon
          } else if (item === 1) {
            result.label = "File"
            result.icon = FileIcon
          }
          return result
        }}
        componentID={uniqueChoiceKey("ChoiceContainer_")}
      />
      {/* CommChoice */}

      <ChoicesContainer
        show={showChoiceNetworkInterfaces}
        mainLabel="Choose a network interface to receive multicast"
        icons={[WifiIcon, EthernetIcon, OtherIcon]}
        items={netInterfaces}
        columns={6}
        chosenCallback={chooseInterface}
        // chosenCallback={() => {}}
        labelLogic={(item: INetInterface) => {
          let result = {
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
        componentID={uniqueChoiceKey("ChoiceContainer_")}
      />
      {/* NetInterfaceChoice */}

    </div>
  )
}
