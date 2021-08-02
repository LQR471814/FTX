type OverlayType = "networkInterfaces" | "commChoice" | "uploadRegion"
type OverlayState = {
	shown: number
	context: CascadingContext | null
}

type AppState = {
	showBanner: number
	bannerStyling: BannerStyle

	activeTransfers: Record<IP, Transfer>
	messageGroups: Record<IP, MessageGroup>

	users: Record<IP, User>
	self: User

	setupInfo: {
		netInterfaces: NetInterface[]
	}

	showOverlay: Record<OverlayType, OverlayState>
}

type ToggleBannerAction = { type: "banner_toggle" }
type ChangeBannerStyleAction = { type: "banner_style_change", bannerStyling: BannerStyle }

type UpdateSelfAction = { type: "self_update", hostname: string }

type UpdateNetInterfaces = { type: "setup_update_netintfs", interfaces: NetInterface[] }

type NewPeerAction = { type: "user_add", user: User }
type RemovePeerAction = { type: "user_remove", id: IP }

//TODO: Update with more sound state later
type NewTransferAction = { type: "transfer_new", id: IP, initial: Transfer }
type UpdateTransferAction = { type: "transfer_update", id: IP, state: TransferState }
type StopTransferAction = { type: "transfer_stop", id: IP }

//TODO: Finish state for these as well
type NewGroupAction = { type: "group_new", id: IP }
type GroupCollapseAction = { type: "group_toggle_collapsed", id: IP }
type SendMessageAction = { type: "message_send", msg: string, destination: IP }
type RecvMessageAction = { type: "message_recv", msg: string, from: IP }

type ToggleOverlayAction = { type: "overlay_toggle", overlay: OverlayType, context: CascadingContext }

type AppAction =
	| ToggleBannerAction
	| ChangeBannerStyleAction
	| NewPeerAction
	| RemovePeerAction
	| UpdateSelfAction
	| UpdateNetInterfaces
	| NewTransferAction
	| UpdateTransferAction
	| StopTransferAction
	| NewGroupAction
	| GroupCollapseAction
	| SendMessageAction
	| RecvMessageAction
	| ToggleOverlayAction
