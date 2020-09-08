import React from 'react';
import ReactDOM from 'react-dom';
import './css/RootStyle.css';
import * as serviceWorker from './serviceWorker';
import ftClient from './appReducer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './App';

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

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
