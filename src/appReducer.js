import { SET_CHANNELS, SET_CURRENT_CHANNEL, SET_MESSAGES } from './actions';
import { combineReducers } from 'redux';

const defaultChannels = [
    {
        user: "",
        index: 0,
        channelMessages: [
            {
                content: "You are not messaging anybody at the moment.",
                author: "Info"
            }
        ]
    }
]

function channels (state = {messageChannels:defaultChannels}, action) {
    switch (action.type) {
        case SET_CHANNELS:
            return Object.assign({}, state, {messageChannels: action.messageChannels})
        default:
            return state;
    }
}

function currentChannel (state = 0, action) {
    switch (action.type) {
        case SET_CURRENT_CHANNEL:
            return Object.assign({}, state, {currentChannel: action.channelIndex})
        default:
            return state
    }
}

function messages (state = {messageChannels:defaultChannels}, action) {
    switch (action.type) {
        case SET_MESSAGES:
            return Object.assign({}, state, {messageChannels: state.messageChannels.map((item, index) => {
                if (index !== action.channelIndex) {
                    return item
                }
                
                item.channelMessages = action.messages
                return item
            })})
        default:
            return state
    }
}

const ftClient = combineReducers({
    channels,
    currentChannel,
    messages
})

export default ftClient