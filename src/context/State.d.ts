import { NetworkInterface, User } from "lib/backend_pb"

type OverlayType = "networkInterfaces" | "commChoice" | "uploadRegion"
type OverlayState = {
	shown: boolean
	context: CascadingContext | null
}

type AppState = {
	showBanner: boolean
	bannerStyling: BannerStyle

	activeTransfers: Record<IP, Transfer>
	messageGroups: Record<IP, MessageGroup>

	users: Record<IP, User>
	self: User

	setupInfo: {
		interfaces: NetworkInterface[]
	}

	showOverlay: Record<OverlayType, OverlayState>
}

type DisplayBannerAction = { type: "banner_display", display: boolean }
type ChangeBannerStyleAction = { type: "banner_style_change", bannerStyling: BannerStyle }

type UpdateSelfAction = { type: "self_update", hostname: string }

type UpdateInterfaces = { type: "setup_update_netintfs", interfaces: NetworkInterface[] }

type SetPeersAction = { type: "peers_set", users: User[] }

//TODO: Update with more sound state later
type NewTransferAction = { type: "transfer_new", id: IP, initial: Transfer }
type UpdateTransferAction = { type: "transfer_update", id: IP, state: TransferState }
type StopTransferAction = { type: "transfer_stop", id: IP }

//TODO: Finish state for these as well
type NewGroupAction = { type: "group_new", id: IP }
type GroupDisplayAction = { type: "group_display", display: boolean, id: IP }
type SendMessageAction = { type: "message_send", msg: string, destination: IP }
type RecvMessageAction = { type: "message_recv", msg: string, from: IP }

type DisplayOverlayAction = {
	type: "overlay_display",
	overlay: OverlayType,
	display: boolean
	context: CascadingContext,
}

type AppAction =
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
