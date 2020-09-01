import {connect} from 'react-redux'
import MessageComponent from '../MessageComponent'

const mapStateToProps = state => ({
    channels: state.channels,
    currentChannel: state.currentChannel
})

const mapDispatchToProps = dispatch => ({
    setMessages: (messages, channelIndex) => dispatch({ type: "SET_MESSAGES", messages: messages, channelIndex: channelIndex })
})

export default connect(mapStateToProps, mapDispatchToProps)(MessageComponent)