import { User, MessageGroup, BannerStyle, IP, Transfer, Interface, OverlayType, OverlayState, TransferState, TransferMetadata } from "lib/apptypes"
import { CascadingContext } from "lib/CascadingContext"

export type AppState = {
	showBanner: boolean
	bannerStyling: BannerStyle

	transferRequests: Record<string, TransferMetadata>
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

type NewRequestAction = { type: "request_new", request: TransferMetadata }
type AcceptRequestAction = { type: "request_accept", id: string }
type DenyRequestAction = { type: "request_deny", id: string }

//TODO: Update with more sound state later
type NewTransferAction = { type: "transfer_new", id: string, initial: Transfer }
type UpdateTransferAction = { type: "transfer_update", id: string, state: TransferState }
type RemoveTransferAction = { type: "transfer_remove", id: string }

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
	| NewRequestAction
	| AcceptRequestAction
	| DenyRequestAction
	| NewTransferAction
	| UpdateTransferAction
	| RemoveTransferAction
	| NewGroupAction
	| GroupDisplayAction
	| SendMessageAction
	| RecvMessageAction
	| DisplayOverlayAction
