import { BannerStyle, IP, MessageGroup, OverlayState, TransferState } from "lib/apptypes"
import { AppState } from "./State"

const defaultField = "Loading..."

export function transferStateDefaults(): TransferState {
	return {
		status: "Pending...",
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

export function messageGroupDefaults(user: IP): MessageGroup {
	return {
		user: user,
		messages: [],
		displayed: true,
	}
}

export function debugDefaults(): AppState {
	return {
		showBanner: true,
		bannerStyling: bannerStylingDefaults(),

		transferRequests: {
			"Desktop 2": {
				from: "192.168.1.1",
				files: [
					{
						name: "File 1.mp3",
						size: 1000,
						type: "audio",
					}
				],
				id: "Gaming"
			},
		},
		activeTransfers: {
			"Desktop 2": {
				outgoing: true,
				peer: "192.168.1.1",
				state: {
					progress: 0.1,
					status: "Pending..."
				},
				worker: null,
			},
			"some dude's macbook": {
				outgoing: true,
				peer: "192.168.1.114",
				state: {
					progress: 0.81,
					status: "Uploading..."
				},
				worker: null,
			}
		},
		messageGroups: {},

		users: {
			"192.168.1.1": {
				ip: "192.168.1.1",
				name: "Desktop 2",
				fileport: 2,
			},
			"192.168.1.114": {
				ip: "192.168.1.114",
				name: "some dude's macbook",
				fileport: 2,
			}
		},
		self: {
			name: defaultField,
			ip: defaultField,
			fileport: 0,
		},
		setupInfo: {
			interfaces: [
				{
					address: "fdc3:24b0:afd7:9548",
					index: 0,
					name: "Ethernet 1"
				},
				{
					address: "192.168.1.1",
					index: 3,
					name: "wifi-kun 1"
				},
				{
					address: "192.168.1.32",
					index: 7,
					name: "WLAN 1"
				},
				{
					address: "123.456.789.10",
					index: 1234567,
					name: "that one strange network bridge polluting your interface list that came from that one super obscure vpn client you installed some time ago"
				},
			]
		},

		showOverlay: {
			networkInterfaces: overlayStateDefaults(false),
			commChoice: overlayStateDefaults(false),
			uploadRegion: overlayStateDefaults(false),
		}
	}
}

export function appDefaults(): AppState {
	// return debugDefaults() //! REMOVE THIS WHEN NOT DEBUGGING
	return {
		showBanner: true,
		bannerStyling: bannerStylingDefaults(),

		transferRequests: {},
		activeTransfers: {},
		messageGroups: {},

		users: {},
		self: {
			name: defaultField,
			ip: defaultField,
			fileport: 0,
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
