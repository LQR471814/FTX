import { BannerStyle, MessageGroup, TransferState } from "lib/apptypes"
import { User } from "lib/backend_pb"
import { AppState, OverlayState } from "./State"

const defaultField = "Loading..."

export function transferStateDefaults(): TransferState {
	return {
		status: "",
		progress: NaN
	}
}

export function overlayStateDefaults(active: boolean): OverlayState {
	return {
		shown: active,
		context: null
	}
}

export function bannerStylingDefaults(): BannerStyle {
	return {
		text: "Choose your network interface",
		buttonText: "Setup",
		backgroundColor: "#ff9100",
		textColor: "#ffffff",
	}
}

export function messageGroupDefaults(user: User): MessageGroup {
	return {
		user: user,
		messages: [],
		displayed: false,
	}
}

export function appDefaults(): AppState {
	const self = new User()
	self.setName(defaultField)
	self.setIp(defaultField)

	return {
		showBanner: false,
		bannerStyling: bannerStylingDefaults(),

		activeTransfers: {},
		messageGroups: {},

		users: {},
		self: self,
		setupInfo: {
			interfaces: []
		},

		showOverlay: {
			networkInterfaces: overlayStateDefaults(false),
			commChoice: overlayStateDefaults(false),
			uploadRegion: overlayStateDefaults(false),
		}
	}
}
