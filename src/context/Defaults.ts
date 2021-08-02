const defaultField = "[Loading...]"

export function transferStateDefaults(): TransferState {
	return {
		status: ""
	}
}

export function overlayStateDefaults(active: number): OverlayState {
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
		collapsed: 1,
	}
}

export function appDefaults(): AppState {
	return {
		showBanner: -1,
		bannerStyling: bannerStylingDefaults(),

		activeTransfers: {},
		messageGroups: {},

		users: {
			'127.0.0.1': {
				name: "yo",
				ip: "127.0.0.1"
			},
			'127.0.0.2': {
				name: "yo",
				ip: "127.0.0.2"
			},
			'127.0.0.3': {
				name: "yo",
				ip: "127.0.0.3"
			},
			'127.0.0.4': {
				name: "yo",
				ip: "127.0.0.4"
			},
		},
		self: {
			name: defaultField,
			ip: defaultField
		},

		setupInfo: {
			netInterfaces: []
		},

		showOverlay: {
			networkInterfaces: overlayStateDefaults(-1),
			commChoice: overlayStateDefaults(-1),
			uploadRegion: overlayStateDefaults(-1),
		}
	}
}