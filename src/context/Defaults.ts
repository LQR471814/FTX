const defaultField = "Loading..."

export function transferStateDefaults(): TransferState {
	return {
		status: ""
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
		messageGroups: {},

		users: {
			'127.0.0.1:7777': {
				name: 'AHHHHHHHHHHHH',
				ip: '127.0.0.1:7777'
			}
		},
		self: {
			name: defaultField,
			ip: defaultField
		},

		setupInfo: {
			netInterfaces: []
		},

		showOverlay: {
			networkInterfaces: overlayStateDefaults(false),
			commChoice: overlayStateDefaults(false),
			uploadRegion: overlayStateDefaults(false),
		}
	}
}
