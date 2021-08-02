import { createContext, useReducer, useContext } from "react";
import { appDefaults, messageGroupDefaults } from "./Defaults";

const defaultState = appDefaults()

const AppContext = createContext<{
	state: AppState
	dispatch: (action: AppAction) => void
} | undefined>(undefined)

function appReducer(state: AppState, action: AppAction) {
	const newState = { ...state }

	switch (action.type) {
		case 'banner_toggle':
			newState.showBanner *= -1
			break
		case 'banner_style_change':
			newState.bannerStyling = action.bannerStyling
			break

		case "self_update":
			newState.self.name = action.hostname
			break

		case "setup_update_netintfs":
			newState.setupInfo.netInterfaces = action.interfaces
			break

		case 'transfer_new':
			newState.activeTransfers[action.id] = action.initial
			break
		case 'transfer_stop':
			console.error("transfer_stop is currently unsupported!")
			break

		case 'group_toggle_collapsed':
			newState.messageGroups[
				action.id
			].collapsed *= -1
			break
		case 'group_new':
			newState.messageGroups[
				action.id
			] = messageGroupDefaults(newState.users[action.id])
			break

		case 'message_send':
			console.error('message_send is currently unsupported!')
			break
		case 'message_recv':
			newState.messageGroups[
				action.from
			].messages.push({
				content: action.msg,
				author: newState.users[action.from].name
			})
			break

		case 'overlay_toggle':
			console.dir(action.overlay)
			newState.showOverlay[action.overlay].shown *= -1
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