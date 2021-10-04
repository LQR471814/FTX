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
		displayed: true,
	}
}

export function appDefaults(): AppState {
	return {
		showBanner: false,
		bannerStyling: bannerStylingDefaults(),

		activeTransfers: {},
		messageGroups: {},

		users: {
			"127.0.0.1": {
				name: "Dave",
				ip: "192.168.1.144",
				filePort: 45611,
			}
		},
		self: {
			name: defaultField,
			ip: defaultField,
			filePort: 0,
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
