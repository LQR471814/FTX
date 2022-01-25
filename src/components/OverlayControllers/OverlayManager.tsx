import { useApp } from "context/AppContext"
import { OverlayType } from "lib/apptypes"
import { uniqueId } from "lib/Utils"
import React, { createElement, FC } from "react"
import CommChoice from "./CommChoice"
import Interfaces from "./Interfaces"
import Upload from "./Upload"

type OverlayComponent = FC<any>

const typeComponentMap: Record<OverlayType, OverlayComponent> = {
	'commChoice': CommChoice,
	'networkInterfaces': Interfaces,
	'uploadRegion': Upload,
}

export default function OverlayManager() {
	const ctx = useApp()
	const showOverlay = ctx.state.showOverlay

	return <>
		{Object.keys(typeComponentMap).map(
			(overlayType) => {
				const type = overlayType as OverlayType

				if (!showOverlay[type].shown) {
					return <React.Fragment
						key={uniqueId('OverlayPlaceholder')}
					/>
				}

				return createElement(typeComponentMap[type], {
					key: uniqueId('Overlay'),
					context: showOverlay[type].context
				})
			}
		)}
	</>
}
