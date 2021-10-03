import { BannerStyle, MessageGroup, TransferState } from "lib/apptypes"
import { User } from './State'
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
	return {
		showBanner: false,
		bannerStyling: bannerStylingDefaults(),

		activeTransfers: {},
		messageGroups: {
			"127.0.0.1": {
				user: {
					name: "LQR471814",
					ip: "127.0.0.1"
				},
				messages: [
					{
						author: "gaming",
						content: "gaming I am"
					}
				],
				displayed: true,
			}
		},

		users: {},
		self: {
			name: defaultField,
			ip: defaultField,
		},
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
