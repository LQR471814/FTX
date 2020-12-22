import React from "react";
import SetupMulticastBanner from "./components/SetupMulticastBanner";
import MessageWindow from "./components/MessageWindow";
import UserList from "./components/UserList";
import PendingTransfers from "./components/PendingTransfers";
import TransferStatus from "./components/TransferStatus";
import ChoicesContainer from "./components/ChoicesContainer";
import { w3cwebsocket as WebSocketClient } from "websocket";
import EmptyBanner from "./components/EmptyBanner";
import { ReactComponent as OtherIcon } from "./css/assets/other.svg";
import { ReactComponent as WifiIcon } from "./css/assets/netinterfaces/wifi.svg";
import { ReactComponent as EthernetIcon } from "./css/assets/netinterfaces/ethernet.svg";
import { ReactComponent as FileIcon } from "./css/assets/file.svg";
import { ReactComponent as MessageIcon } from "./css/assets/message.svg";
import _ from "lodash";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showChoiceNetworkInterfaces: false,
      showCommChoice: false,
      showSetupBanner: true,
      groups: {},
      netInterfaces: [
        [1, "asjdofjasjdofj"],
        [1, "Wi-Fi"],
        [1, "Ethernet"],
        [1, "asjdofjasjdofj"],
        [1, "Wi-Fi"],
        [1, "Ethernet"],
        [1, "asjdofjasjdofj"],
        [1, "Wi-Fi"],
        [1, "Ethernet"],
        [1, "asjdofjasjdofj"],
        [1, "Wi-Fi"],
        [1, "Ethernet"],
        [1, "asjdofjasjdofj"],
        [1, "Wi-Fi"],
        [1, "Ethernet"],
        [1, "asjdofjasjdofj"],
        [1, "Wi-Fi"],
        [1, "Ethernet"],
      ],
      currentTargetUser: undefined,
    };

    this.displayChoiceNetworkInterfaces = this.displayChoiceNetworkInterfaces.bind(
      this
    );
    this.displayChoiceComm = this.displayChoiceComm.bind(this);
    this.showSetupBanner = this.showSetupBanner.bind(this);
    this.addToGroup = this.addToGroup.bind(this);
    this.setCurrentTargetUser = this.setCurrentTargetUser.bind(this);
    this.onCommChosen = this.onCommChosen.bind(this);
    this.replyMessage = this.replyMessage.bind(this);
    this.chooseInterface = this.chooseInterface.bind(this);
    this.onRecvMessage = this.onRecvMessage.bind(this);
    this.setCollapsed = this.setCollapsed.bind(this);

    this.setupBanner = EmptyBanner;
    this.hostname = { value: undefined };

    this.recvMsgSocket = new WebSocketClient("ws://localhost:3000/recvMessage");
    this.recvMsgSocket.onopen = () => {
      console.log("Connected to message out.");
    };
    this.recvMsgSocket.onmessage = (message) => {
      var messageObj = JSON.parse(message.data);
      this.onRecvMessage(messageObj.Message, messageObj.User);
    };

    this.resourceSocket = new WebSocketClient("ws://localhost:3000/resource");
    this.resourceSocket.onopen = () => {
      console.log("Connected to resource.");
      this.resourceSocket.send(
        JSON.stringify({ name: "getHostname", parameters: {} })
      );
      this.resourceSocket.send(
        JSON.stringify({ name: "getOS", parameters: {} })
      );
      this.resourceSocket.send(
        JSON.stringify({ name: "requireSetup", parameters: {} })
      );
    };
    this.resourceSocket.onmessage = (message) => {
      var messageObj = JSON.parse(message.data);
      console.log(messageObj);
      switch (messageObj.MsgType) {
        case "getInterfaces":
          this.setState({ netInterfaces: messageObj.Response.GetInterfaces });
          break;
        case "getOS":
          this.os = { value: messageObj.Response.GetOS.toLowerCase() };
          break;
        case "getHostname":
          this.hostname.value = messageObj.Response.GetHostname;
          this.forceUpdate();
          break;
        case "requireSetup":
          if (messageObj.Response.RequireSetup === true) {
            this.resourceSocket.send(
              JSON.stringify({ name: "getInterfaces", parameters: {} })
            );
          }
          this.showSetupBanner(messageObj.Response.RequireSetup);
          break;
        default:
          break;
      }
    };
  }

  componentDidMount() {
    this.showSetupBanner(true);
  }

  setCollapsed(user, opened) {
    var newGroups = _.cloneDeep(this.state.groups);
    newGroups[user].collapsed = opened;
    this.setState({ groups: newGroups });
  }

  onRecvMessage(message, user) {
    var newGroups = _.cloneDeep(this.state.groups);
    if (newGroups[user] !== undefined) {
      newGroups[user].messages.push({ content: message, author: user });
    } else {
      newGroups[user] = {
        collapsed: -1,
        messages: [{ content: message, author: user }],
      };
    }
    console.log(newGroups);
    this.setState({ groups: newGroups });
  }

  replyMessage(message, destHost) {
    var newGroups = _.cloneDeep(this.state.groups);
    newGroups[destHost].messages.push({ content: message, author: "You" });
    this.setState({ groups: newGroups });
    this.resourceSocket.send(
      JSON.stringify({
        name: "sendMessage",
        parameters: { MessageDestination: destHost, Message: message },
      })
    );
  }

  setCurrentTargetUser(user) {
    this.setState({ currentTargetUser: user });
  }

  onCommChosen(type) {
    this.setState({ showCommChoice: false });
    if (type === "Message") {
      this.addToGroup([], this.state.currentTargetUser, -1);
    }
  }

  addToGroup(messages, user, opened) {
    var newGroups = _.cloneDeep(this.state.groups);
    if (newGroups[user] === undefined) {
      newGroups[user] = { collapsed: opened, messages: messages };

      this.setState({ groups: newGroups });
    } else {
      this.setCollapsed(user, -1);
    }
  }

  displayChoiceNetworkInterfaces(show) {
    this.setState({ showChoiceNetworkInterfaces: show });
  }

  displayChoiceComm(show) {
    this.setState({ showCommChoice: show });
  }

  showSetupBanner(show) {
    this.setupBanner = SetupMulticastBanner;
    if (show === false) {
      document.getElementById("AppGrid").style.gridTemplateRows = "auto";
    } else {
      document.getElementById("AppGrid").style.gridTemplateRows = "45px auto";
    }
    this.setState({ showSetupBanner: show });
  }

  chooseInterface(intf) {
    this.resourceSocket.send(
      JSON.stringify({
        name: "setInterfaces",
        parameters: { InterfaceID: parseInt(intf) },
      })
    );
  }

  render() {
    return (
      <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
        <div
          className="AppDiv"
          id="AppGrid"
          style={{ gridTemplateRows: "auto" }}
        >
          {this.state.showSetupBanner && (
            <this.setupBanner
              displayChoiceNetworkInterfaces={
                this.displayChoiceNetworkInterfaces
              }
            />
          )}
          <MessageWindow
            ref={this.MessageWindowRef}
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
          labelLogic={(item) => {
            var result = { label: "", icon: OtherIcon };
            if (item === 0) {
              result.label = "Message";
              result.icon = MessageIcon;
            } else if (item === 1) {
              result.label = "File";
              result.icon = FileIcon;
            }
            return result;
          }}
        />{" "}
        {/* CommChoice */}
        <ChoicesContainer
          show={this.state.showChoiceNetworkInterfaces}
          mainLabel="Choose a network interface to receive multicast"
          icons={[WifiIcon, EthernetIcon, OtherIcon]}
          items={this.state.netInterfaces}
          columns={6}
          chosenCallback={this.chooseInterface}
          labelLogic={(item) => {
            var result = {
              label: item[1],
              icon: OtherIcon,
              identifier: item[0],
            };
            if (item[1].includes("Wi-Fi") || item[1].includes("Wlan")) {
              result.icon = WifiIcon;
            } else if (
              item.includes("Local Area Connection") ||
              item[1].includes("LAN") ||
              item[1].includes("Ethernet")
            ) {
              result.icon = EthernetIcon;
            }
            return result;
          }}
        />{" "}
        {/* NetInterfaceChoice */}
      </div>
    );
  }
}

export default App;
