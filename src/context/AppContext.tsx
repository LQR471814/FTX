import { createContext, useReducer, useContext } from "react";
import { appDefaults, messageGroupDefaults } from "./Defaults";
import { AppState, AppAction } from "./State";

const defaultState = appDefaults()

const AppContext = createContext<{
	state: AppState
	dispatch: (action: AppAction) => void
} | undefined>(undefined)

function appReducer(state: AppState, action: AppAction) {
	const newState = { ...state }

	switch (action.type) {
		case 'banner_display':
			newState.showBanner = action.display
			break
		case 'banner_style_change':
			newState.bannerStyling = action.bannerStyling
			break

		case "self_update":
			newState.self.name = action.hostname
			break

		case "setup_update_netintfs":
			newState.setupInfo.interfaces = action.interfaces
			break

		case "peers_set":
			newState.users = action.users
			break

		case 'transfer_new':
			newState.activeTransfers[action.id] = action.initial
			break
		case 'transfer_update':
			newState.activeTransfers[action.id].state = action.state
			break
		case 'transfer_stop':
			console.error("transfer_stop is currently unsupported!")
			break

		case 'group_display':
			newState.messageGroups[
				action.peer
			].displayed = action.display
			break
		case 'group_new':
			newState.messageGroups[
				action.peer
			] = messageGroupDefaults(action.peer)
			break

		case 'message_send':
			newState.messageGroups[
				action.destination
			].messages.push({
				content: action.msg,
				author: "You"
			})
			break
		case 'message_recv':
			console.log(action, newState.messageGroups)

			let newGroup = newState.messageGroups[action.from]
			if (!newGroup) {
				newGroup = messageGroupDefaults(action.from)
			}

			newGroup.messages.push({
				content: action.msg,
				author: action.from,
			})

			newState.messageGroups[action.from] = newGroup
			break

		case 'overlay_display':
			newState.showOverlay[action.overlay].shown = action.display
			newState.showOverlay[action.overlay].context = action.context
			break

		default:
			console.error("Dispatched action is not valid")
			break
	}

	return newState
}

function AppProvider(props: { children: React.ReactChild }) {
	const [state, dispatch] = useReducer(appReducer, defaultState)

	return (
		<AppContext.Provider value={{ state, dispatch }}>
			{props.children}
		</AppContext.Provider>
	)
}

function useApp() {
	const context = useContext(AppContext)
	if (context === undefined) {
		throw new Error('useApp must be used inside an AppProvider')
	}

	return context
}

export { AppProvider, useApp }