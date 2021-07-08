import { useEffect, useRef, useState } from "react"
import Banner from "components/Banner/Banner"
import Window from "components/Layout/Window/Window"
import MessageComponent from "components/MessagePanel/MessageComponent"
import UserList from "components/UserList/UserList"
import ChoicesContainer from "components/Choice/ChoicesContainer"
import ArrayLayout from "components/Layout/Array/Array"

import { ReactComponent as OtherIcon } from "styling/assets/other.svg"
import { ReactComponent as WifiIcon } from "styling/assets/interfaceLogos/wifi.svg"
import { ReactComponent as EthernetIcon } from "styling/assets/interfaceLogos/ethernet.svg"
import { ReactComponent as FileIcon } from "styling/assets/file.svg"
import { ReactComponent as MessageIcon } from "styling/assets/message.svg"

import _ from "lodash"
import UploadRegion from "components/UploadRegion/UploadRegion"
import TransferStatus from "components/TransferStatus/TransferStatus"

// eslint-disable-next-line import/no-webpack-loader-syntax
import UploadWorker from 'worker-loader!./components/TransferStatus/upload_worker_manager.js'
import PendingTransfers from "components/PendingTransfers/PendingTransfers"

import * as backendIntf from "lib/BackendInterface"

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
  const [activeTransfers, setActiveTransfers] = useState<Transfer[]>([])

  const [showBanner, setShowBanner] = useState(true)
  const [groups, setGroups] = useState({} as Record<string, IMessageGroup>)
  const [banner] = useState(
    {
      text: "Choose your network interface",
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

  useEffect(() => {
    //? Initialize websockets
    backendIntf.initialize()

    backendIntf.resourceSocket.request(
      backendIntf.REQ_HOSTNAME, {}
    )?.then((msg: any) => {
      setHostname(msg.Response.GetHostname)
    })

    backendIntf.resourceSocket.request(
      backendIntf.REQ_SETUP_REQUIREMENT, {}
    )?.then((msg: any) => {
      if (msg.Response.RequireSetup === true) {
        backendIntf.resourceSocket.request(
          backendIntf.REQ_INTERFACES, {}
        )?.then((msg: any) => {
          setNetInterfaces(msg.Response.GetInterfaces)
        })
      }
    })

    backendIntf.recvMessage.listen((msg) => {
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

      if (typeof msg.data === "string") {
        onRecvMessage(msg.Message, msg.User)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const uniqueChoiceKey = (prefix: string) => {
    currentChoiceKey.current++
    return prefix + currentChoiceKey.current.toString()
  }

  const replyMessage = (messageContent: string, destHost: string) => {
    const newGroups = _.cloneDeep(groups)
    newGroups[destHost].messages.push({ content: messageContent, author: "You" })
    setGroups(newGroups)

    backendIntf.resourceSocket.request(
      backendIntf.REQ_SEND_MESSAGE,
      {
        MessageDestination: destHost,
        Message: messageContent
      }
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
      backendIntf.resourceSocket.request(
        backendIntf.REQ_SET_INTERFACES,
        { InterfaceID: parseInt(intf as string) }
      )

      setShowBanner(false)
    }
    setShowNetworkInterfacesChoice(false)
  }

  return (
    <div className="AppRoot">
      <ArrayLayout childrenSizes="min-content minmax(0, 1fr)">
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

        <ArrayLayout rows={true}>
          <Window title="Messages">
            <MessageComponent
              groups={groups}
              submitMessage={replyMessage}
              setCollapsed={setCollapsed}
            />
          </Window>

          <ArrayLayout childrenSizes="min-content 1fr">
            <Window title="User List">
              <UserList
                hostname={hostname}
                setShowCommChoice={setShowCommChoice}
              />
            </Window>

            <ArrayLayout rows={true}>
              <Window title="Pending Transfers">
                <PendingTransfers />
              </Window>
              <Window title="Transfer Status">
                <TransferStatus activeTransfers={activeTransfers} />
              </Window>
            </ArrayLayout>
          </ArrayLayout>

        </ArrayLayout>
      </ArrayLayout>

      {showNetworkInterfacesChoice ?
        <ChoicesContainer
          mainLabel="Choose a network interface"
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

          const currentTransferIndex = activeTransfers.length
          const setNewState = (newState: TransferState) => {
            console.log(activeTransfers, currentTransferIndex)
            const mutateTransfers = activeTransfers
            mutateTransfers[currentTransferIndex].state = newState

            setActiveTransfers(mutateTransfers)
          }
          const setCurrentStatus = (status: string) => {
            setNewState({ status: status })
          }

          worker.onmessage = (e: MessageEvent) => {
            const msg = e.data

            switch (msg.type) {
              case 'status':
                setCurrentStatus(msg.message)
                console.log(msg.message)
                break
              case 'error':
                setCurrentStatus(msg.message)
                worker.terminate()
                break
              case 'read_progress':
                const readDisplay = `Reading in progress: ${Math.round((msg.loaded / msg.total) * 100)}%`
                setCurrentStatus(readDisplay)

                console.log(readDisplay)
                break
              case 'upload_progress':
                const uploadDisplay = `Uploading: ${Math.round((msg.loaded / msg.total) * 100)}%`
                setCurrentStatus(uploadDisplay)

                console.log(uploadDisplay)
                break
              case 'terminate_worker':
                worker.terminate()
                break
              default:
                console.log(msg)
                break
            }
          }

          setActiveTransfers([...activeTransfers, {
            worker: worker,
            state: {
              status: 'Initializing...'
            }
          }])

          worker.postMessage(
            {
              type: 'start',
              targetUser: currentTargetUser.current,
              files: Array.from(files),
              from: hostname
            }
          )
        }
      } /> : undefined}
    </div>
  )
}
