import React from 'react';
import ReactDOM from 'react-dom';
import './css/RootStyle.css';
import * as serviceWorker from './serviceWorker';
import MessageComponentContainer from './components/containers/MessageComponentContainer';
import UserList from './components/UserList';
import PendingTransfers from './components/PendingTransfers';
import TransferStatus from './components/TransferStatus';
import ftClient from './appReducer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { w3cwebsocket as WebSocketClient } from 'websocket';
import SetupMulticastBanner from './components/SetupMulticastBanner';

const defaultChannels = [
    {
        user: "Info",
        index: 0,
        channelMessages: [
            {
                content: "You are not messaging anybody at the moment.",
                author: "Info"
            }
        ]
    }
]

const initState = {
    channels: defaultChannels,
    currentChannel: 0
}
const store = createStore(ftClient, initState);

var commSocket = new WebSocketClient("ws://localhost:4000")
commSocket.onopen = () => {
    console.log("Connected to backend.")
}
commSocket.onmessage = (message) => {
    console.log(message)
    var messageObj = JSON.parse(message.data);
    switch (messageObj.type) {
        case "addUser":
            this.addUser(messageObj.user)
            break;
        case "removeUser":
            this.removeUser(messageObj.user)
            break;
        default:
            break;
    }
}

ReactDOM.render(
    <Provider store={store}>
        <div className="AppDiv" id="AppGrid">
            <SetupMulticastBanner />
            <MessageComponentContainer />
            <div className="Col" style={{overflow: "hidden"}}>
                <UserList commSocket={commSocket} />
                <PendingTransfers />
                <TransferStatus />
            </div>
        </div>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
