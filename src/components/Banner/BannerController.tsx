import { useApp } from "context/AppContext"
import Banner from "./Banner"

export default function BannerController() {
	const ctx = useApp()
	const bannerStyle = ctx.state.bannerStyling

	return (
		<Banner
			show={ctx.state.showBanner > 0}
			style={bannerStyle}
			click={() => {
				ctx.dispatch({
					type: "overlay_toggle",
					overlay: "networkInterfaces"
				})
			}}
			closedCallback={() => ctx.dispatch(
				{ type: "banner_toggle" }
			)}
		/>
	)
}
