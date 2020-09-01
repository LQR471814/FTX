export const SET_CHANNELS = "SET_CHANNELS"
export const SET_CURRENT_CHANNEL = "SET_CURRENT_CHANNEL"
export const SET_MESSAGES = "SET_MESSAGES"

export function setChannels(messageChannels) {
    return { type: SET_MESSAGES, messageChannels: messageChannels}
}

export function setCurrentChannel(channelIndex) {
    return { type: SET_CURRENT_CHANNEL, channelIndex: channelIndex }
}

export function setMessages(messages, channelIndex) {
    return { type: SET_MESSAGES, messages: messages, channelIndex: channelIndex }
}