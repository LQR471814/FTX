import { User, MessageGroup, BannerStyle, IP, Transfer, Interface, OverlayType, OverlayState, TransferState, TransferRequest } from "lib/apptypes"
import { CascadingContext } from "lib/CascadingContext"

export type AppState = {
	showBanner: boolean
	bannerStyling: BannerStyle

	transferRequests: Record<string, TransferRequest>
	activeTransfers: Record<string, Transfer>
	messageGroups: Record<IP, MessageGroup>

	users: Record<IP, User>
	self: User

	setupInfo: {
		interfaces: Interface[]
	}

	showOverlay: Record<OverlayType, OverlayState>
}

type DisplayBannerAction = { type: "banner_display", display: boolean }
type ChangeBannerStyleAction = { type: "banner_style_change", bannerStyling: BannerStyle }

type UpdateSelfAction = { type: "self_update", hostname: string }

type UpdateInterfaces = { type: "setup_update_netintfs", interfaces: Interface[] }

type SetPeersAction = { type: "peers_set", users: Record<IP, User> }

//TODO: Update with more sound state later
type NewTransferAction = { type: "transfer_new", id: string, initial: Transfer }
type UpdateTransferAction = { type: "transfer_update", id: string, state: TransferState }
type StopTransferAction = { type: "transfer_stop", id: string }

//TODO: Finish state for these as well
type NewGroupAction = { type: "group_new", peer: IP }
type GroupDisplayAction = { type: "group_display", display: boolean, peer: IP }
type SendMessageAction = { type: "message_send", msg: string, destination: IP }
type RecvMessageAction = { type: "message_recv", msg: string, from: IP }

type DisplayOverlayAction = {
	type: "overlay_display",
	overlay: OverlayType,
	display: boolean
	context: CascadingContext,
}

export type AppAction =
	| DisplayBannerAction
	| ChangeBannerStyleAction
	| SetPeersAction
	| UpdateSelfAction
	| UpdateInterfaces
	| NewTransferAction
	| UpdateTransferAction
	| StopTransferAction
	| NewGroupAction
	| GroupDisplayAction
	| SendMessageAction
	| RecvMessageAction
	| DisplayOverlayAction
