import { useCallback, useRef, useState } from "react"
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
import UploadRegion from "components/UploadRegion/UploadRegion"
import TransferStatus from "components/TransferStatus/TransferStatus"

// eslint-disable-next-line import/no-webpack-loader-syntax
import UploadWorker from 'worker-loader!./components/TransferStatus/upload_worker.js'
import PendingTransfers from "components/PendingTransfers/PendingTransfers"

const wifiKeywords = [
  "wi-fi",
  "wifi",
  "wi fi",
  "wlan",
  "wireless",
]

const lanKeywords = [
  "lan",
  "local area network",
  "ethernet",
]

function containsKeywords(str: string, keywords: Array<string>) {
  for (const word of keywords) {
    if (str.toLowerCase().includes(word)) return true
  }
  return false
}

export default function App() {
  const [activeWorkers, setActiveWorkers] = useState<Array<Worker>>([])

  const [showBanner, setShowBanner] = useState(true)
  const [groups, setGroups] = useState({} as Record<string, IMessageGroup>)
  const [banner] = useState(
    {
      text: "Make sure multicast peer discovery is working on your device",
      buttonText: "Setup",
      backgroundColor: "#ff9100",
      textColor: "#ffffff",
    }
  )

  const [netInterfaces, setNetInterfaces]: [INetInterface[], Function] = useState([
    ["7", "Ethernet 3", "169.254.80.66/16"],
    ["63", "vEthernet (Network Bridge)", "192.168.32.1/20"],
    ["68", "vEthernet (Default Switch) 2", "172.26.48.1/20"],
    ["22", "Network Bridge", "192.168.1.6/24"],
    ["31", "Local Area Connection* 1", "169.254.119.232/16"],
    ["16", "Local Area Connection* 2", "169.254.145.230/16"],
    ["23", "Ethernet 4", "169.254.190.23/16"],
    ["17", "Bluetooth Network Connection 3", "169.254.147.224/16"],
    ["1", "Loopback Pseudo-Interface 1", "127.0.0.1/8"],
    ["73", "vEthernet (Ethernet 3)", "172.24.192.1/20"],
    ["64", "vEthernet (Ethernet 4)", "172.21.32.1/20"]
  ])
  const [hostname, setHostname] = useState("")

  const [showNetworkInterfacesChoice, setShowNetworkInterfacesChoice] = useState(false)
  const [showUploadRegion, setShowUploadRegion] = useState(false)
  const [showCommChoice, setShowCommChoiceState] = useState(false)

  //? Initialize variables
  const currentChoiceKey = useRef(0)
  const currentTargetUser = useRef<User>({ name: "", ip: "" })

  //? Initialize Websocket Connections
  const recvMsgSocket = new WebSocketClient("ws://localhost:3000/recvMessage")

  recvMsgSocket.onopen = useCallback(
    () => {
      console.log("Connected to message out.")
    },
    []
  )

  recvMsgSocket.onmessage = useCallback(
    (message) => {
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

      if (typeof message.data === "string") {
        let messageObj = JSON.parse(message.data)
        onRecvMessage(messageObj.Message, messageObj.User)
      }
    },
    [groups]
  )

  const resourceSocket = useRef(new WebSocketClient("ws://localhost:3000/resource")).current
  resourceSocket.onopen = useCallback(() => {
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
  }, [resourceSocket])

  resourceSocket.onmessage = useCallback((message) => {
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
  }, [resourceSocket])

  const uniqueChoiceKey = (prefix: string) => {
    currentChoiceKey.current++
    return prefix + currentChoiceKey.current.toString()
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

  // * When a user is chosen from UserList
  const setShowCommChoice = (user: User) => {
    setShowCommChoiceState(true)
    currentTargetUser.current = user
  }

  // * When a message / file transfer is chosen
  const onCommChosen = (type: Primitive | undefined) => {
    switch (type) {
      case "MESSAGE":
        addToGroups([], currentTargetUser.current.name, -1)
        break
      case "FILE":
        setShowUploadRegion(true)
        break
    }
    setShowCommChoiceState(false)
  }

  // * Un-collapse / Collapse user's message group
  const setCollapsed = (user: string, opened: number) => {
    const newGroups = _.cloneDeep(groups)
    newGroups[user].collapsed = opened
    setGroups(newGroups)
  }

  // * Add message group
  const addToGroups = (initMessages: IMessage[], user: string, opened: number) => {
    const newGroups = _.cloneDeep(groups)

    console.log(initMessages, user, opened)

    if (newGroups[user] === undefined) { //? If user doesn't exist
      newGroups[user] = { messages: initMessages, collapsed: opened }
      setGroups(newGroups)
      return
    }

    setCollapsed(user, -1)
  }

  // * Callback when user has chosen network interface
  const chooseInterface = (intf: Primitive | undefined) => {
    if (intf !== undefined) {
      // resourceSocket.send(
      //   JSON.stringify({
      //     name: "setInterfaces",
      //     parameters: { InterfaceID: parseInt(intf as string) },
      //   })
      // )

      setShowBanner(false)
    }
    setShowNetworkInterfacesChoice(false)
  }

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <div className="AppDiv" id="AppGrid">
        <Banner
          show={showBanner}
          callback={
            () => {
              setShowNetworkInterfacesChoice(true)
            }
          }
          closedCallback={
            () => {
              setShowBanner(false)
            }
          }
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
              setShowCommChoice={setShowCommChoice}
            />
          </Window>
          <Window height="30%" title="Pending Transfers">
            <PendingTransfers />
          </Window>
          <Window height="30%" title="Transfer Status">
            <TransferStatus activeWorkers={activeWorkers} />
          </Window>
        </div>

      </div>

      {showNetworkInterfacesChoice ?
        <ChoicesContainer
          mainLabel="Choose a network interface to receive multicast"
          items={
            netInterfaces.map(
              (intf: INetInterface) => {
                const item = {
                  label: `${intf[1]} [${intf[2]}]`,
                  icon: OtherIcon,
                  identifier: intf[0],
                }

                if (containsKeywords(intf[1], wifiKeywords)) {
                  item.icon = WifiIcon
                } else if (containsKeywords(intf[1], lanKeywords)) {
                  item.icon = EthernetIcon
                }

                return item
              }
            )
          }
          chosenCallback={chooseInterface}
          componentID={uniqueChoiceKey("ChoiceContainer_")}
        /> : undefined}

      {showCommChoice ?
        <ChoicesContainer
          mainLabel="Choose what to send"
          items={
            [
              { label: "Message", icon: MessageIcon, identifier: "MESSAGE" },
              { label: "File", icon: FileIcon, identifier: "FILE" },
            ]
          }
          chosenCallback={onCommChosen}
          componentID={uniqueChoiceKey("ChoiceContainer_")}
        /> : undefined}

      {showUploadRegion ? <UploadRegion onChosen={
        (files: FileList | null) => {
          setShowUploadRegion(false)
          if (!files) return

          const worker = new UploadWorker()
          worker.postMessage(
            {
              type: 'start',
              targetUser: {
                name: currentTargetUser.current
              },
              files: files
            }
          )

          setActiveWorkers([...activeWorkers, worker])
        }
      } /> : undefined}
    </div>
  )
}
