import { useApp } from "context/AppContext"
import Banner from "./Banner"

export default function BannerController() {
	const ctx = useApp()
	const bannerStyle = ctx.state.bannerStyling

	return (
		<Banner
			show={ctx.state.showBanner}
			style={bannerStyle}
			click={() => {
				ctx.dispatch({
					type: "overlay_display",
					overlay: "networkInterfaces",
					display:  true,
					context: null
				})
			}}
			closedCallback={() => ctx.dispatch({
				type: "banner_display",
				display: true
			})}
		/>
	)
}
