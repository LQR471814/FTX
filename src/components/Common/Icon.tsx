import React from "react"

type ReactSVGProps = React.SVGProps<SVGSVGElement>

type AssetMap = {
	[key: number]: (props: ReactSVGProps) => JSX.Element
}

export enum IconAssets {
	//? Interfaces
	i_ethernet,
	i_wifi,
	i_other,
	//? File Types
	f_default,
	f_threeD,
	f_archive,
	f_audio,
	f_document,
	f_pdf,
	f_font,
	f_image,
	f_video,
	//? Others
	message,
	thick_close,
	check,
	close,
	transfer,
}

export const icons: AssetMap = {
	[IconAssets.i_ethernet]: (props: ReactSVGProps) =>
		<svg
			viewBox="0.0019931793212890625 36.04899978637695 512 439.9040222167969"
			xmlSpace="preserve"
			{...props}
		>
			<g>
				<path d="m145.48 368.56h73.953v27.379h73.133v-27.378h73.953v-57.248h54.282v-192.94h-329.6v192.94h54.282v57.247zm3.656-156.3v-48.926h21.457v48.926h-21.457zm48.066 0v-48.926h21.457v48.926h-21.457zm48.067 0v-48.926h21.457v48.926h-21.457zm48.066 0v-48.926h21.461v48.926h-21.461zm48.066 0v-48.926h21.461v48.926h-21.461z"></path>
				<path d="m481.1 36.049h-450.2c-17.066 0-30.898 13.836-30.898 30.902v378.1c0 17.066 13.832 30.902 30.898 30.902h450.2c17.066 0 30.902-13.836 30.902-30.902v-378.1c1e-3 -17.066-13.835-30.902-30.901-30.902zm0 30.902v378.1h-450.2v-378.1h450.2z"></path>
			</g>
		</svg>,
	[IconAssets.i_wifi]: (props: ReactSVGProps) =>
		<svg viewBox="0 0 24 24" {...props}>
			<path fill="none" d="M0 0h24v24H0z"/>
			<path d="M6 19h12V9.157l-6-5.454-6 5.454V19zm13 2H5a1 1 0 0 1-1-1v-9H1l10.327-9.388a1 1 0 0 1 1.346 0L23 11h-3v9a1 1 0 0 1-1 1zM8 10a7 7 0 0 1 7 7h-2a5 5 0 0 0-5-5v-2zm0 4a3 3 0 0 1 3 3H8v-3z"/>
		</svg>,
	[IconAssets.i_other]: (props: ReactSVGProps) =>
		<svg viewBox="0 0 24 24" {...props}>
			<path d="M12,24A12,12,0,1,1,24,12,12,12,0,0,1,12,24ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Z"/>
			<path d="M7.76,12a1.94,1.94,0,1,1-1.94-1.94A1.94,1.94,0,0,1,7.76,12ZM12,10.06A1.94,1.94,0,1,0,13.94,12,1.94,1.94,0,0,0,12,10.06Zm6.18,0A1.94,1.94,0,1,0,20.12,12,1.94,1.94,0,0,0,18.18,10.06Z"/>
		</svg>,
	[IconAssets.f_default]: (props: ReactSVGProps) =>
		<svg viewBox="0 0 24 24" width="24" height="24" {...props}>
			<path fill="none" d="M0 0h24v24H0z" />
			<path d="M9 2.003V2h10.998C20.55 2 21 2.455 21 2.992v18.016a.993.993 0 0 1-.993.992H3.993A1 1 0 0 1 3 20.993V8l6-5.997zM5.83 8H9V4.83L5.83 8zM11 4v5a1 1 0 0 1-1 1H5v10h14V4h-8z" />
		</svg>,
	[IconAssets.f_threeD]: (props: ReactSVGProps) =>
		<svg viewBox="0 0 20.81 23.57" {...props}>
			<path d="M10.22,0h.37l.29.17,9.43,5.38a.89.89,0,0,1,.5.87q0,5.34,0,10.66a1,1,0,0,1-.56,1c-3.23,1.83-6.44,3.67-9.66,5.51h-.37l-.33-.19C6.75,21.59,3.62,19.79.48,18A.86.86,0,0,1,0,17.17Q0,11.79,0,6.4a.87.87,0,0,1,.48-.84Q5.36,2.79,10.22,0ZM1.4,7.45a.32.32,0,0,0,0,.08c0,3.08,0,6.17,0,9.25,0,.15.08.19.18.25l8,4.54.2.11v-.25c0-3,0-6,0-9a.33.33,0,0,0-.2-.34L1.64,7.57Zm9.7,14.23.16-.09,8-4.56a.31.31,0,0,0,.16-.32c0-3,0-6,0-9V7.44l-.26.13c-2.63,1.5-5.25,3-7.88,4.5a.34.34,0,0,0-.2.34q0,4.52,0,9ZM18.71,6.24l-.11-.07-8-4.6a.29.29,0,0,0-.34,0L2.28,6.13l-.17.11.1.06,8,4.61a.32.32,0,0,0,.36,0L18,6.67Z" />
		</svg>,
	[IconAssets.f_archive]: (props: ReactSVGProps) =>
		<svg viewBox="0 0 24 24" width="24" height="24" {...props}>
			<path fill="none" d="M0 0h24v24H0z" />
			<path d="M20 22H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1zm-1-2V4H5v16h14zm-5-8v5h-4v-3h2v-2h2zm-2-8h2v2h-2V4zm-2 2h2v2h-2V6zm2 2h2v2h-2V8zm-2 2h2v2h-2v-2z" />
		</svg>,
	[IconAssets.f_audio]: (props: ReactSVGProps) =>
		<svg viewBox="0 0 24 24" width="24" height="24" {...props}>
			<path fill="none" d="M0 0h24v24H0z" />
			<path d="M15 4.582V12a3 3 0 1 1-2-2.83V2.05c5.053.501 9 4.765 9 9.95 0 5.523-4.477 10-10 10S2 17.523 2 12c0-5.185 3.947-9.449 9-9.95v2.012A8.001 8.001 0 0 0 12 20a8 8 0 0 0 3-15.418z" />
		</svg>,
	[IconAssets.f_document]: (props: ReactSVGProps) =>
		<svg viewBox="0 0 24 24" width="24" height="24" {...props}>
			<path fill="none" d="M0 0h24v24H0z" />
			<path d="M21 8v12.993A1 1 0 0 1 20.007 22H3.993A.993.993 0 0 1 3 21.008V2.992C3 2.455 3.449 2 4.002 2h10.995L21 8zm-2 1h-5V4H5v16h14V9zM8 7h3v2H8V7zm0 4h8v2H8v-2zm0 4h8v2H8v-2z" />
		</svg>,
	[IconAssets.f_font]: (props: ReactSVGProps) =>
		<svg viewBox="0 0 24 24" width="24" height="24" {...props}>
			<path fill="none" d="M0 0h24v24H0z" />
			<path d="M11.246 15H4.754l-2 5H.6L7 4h2l6.4 16h-2.154l-2-5zm-.8-2L8 6.885 5.554 13h4.892zM21 12.535V12h2v8h-2v-.535a4 4 0 1 1 0-6.93zM19 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
		</svg>,
	[IconAssets.f_image]: (props: ReactSVGProps) =>
		<svg viewBox="0 0 24 24" width="24" height="24" {...props}>
			<path fill="none" d="M0 0h24v24H0z" />
			<path d="M4.828 21l-.02.02-.021-.02H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H4.828zM20 15V5H4v14L14 9l6 6zm0 2.828l-6-6L6.828 19H20v-1.172zM8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
		</svg>,
	[IconAssets.f_video]: (props: ReactSVGProps) =>
		<svg viewBox="0 0 24 24" width="24" height="24" {...props}>
			<path fill="none" d="M0 0h24v24H0z" />
			<path d="M3 3.993C3 3.445 3.445 3 3.993 3h16.014c.548 0 .993.445.993.993v16.014a.994.994 0 0 1-.993.993H3.993A.994.994 0 0 1 3 20.007V3.993zM5 5v14h14V5H5zm5.622 3.415l4.879 3.252a.4.4 0 0 1 0 .666l-4.88 3.252a.4.4 0 0 1-.621-.332V8.747a.4.4 0 0 1 .622-.332z" />
		</svg>,
	[IconAssets.f_pdf]: (props: ReactSVGProps) =>
		<svg viewBox="0 0 24 24" width="24" height="24" {...props}>
			<path fill="none" d="M0 0h24v24H0z"/>
			<path d="M12 16H8V8h4a4 4 0 1 1 0 8zm-2-6v4h2a2 2 0 1 0 0-4h-2zm5-6H5v16h14V8h-4V4zM3 2.992C3 2.444 3.447 2 3.999 2H16l5 5v13.993A1 1 0 0 1 20.007 22H3.993A1 1 0 0 1 3 21.008V2.992z"/>
		</svg>,
	[IconAssets.message]: (props: ReactSVGProps) =>
		<svg viewBox="0 0 223 220" {...props}>
			<rect width="223" height="164" rx="46" />
			<polygon points="193.65 220 179.65 161.48 107.15 161.48 193.65 220" />
		</svg>,
	[IconAssets.thick_close]: (props: ReactSVGProps) =>
		<svg viewBox="0 0 49.253 49.253" {...props}>
			<g transform="translate(-80.374 -123.87)" strokeWidth="0.265">
				<rect transform="rotate(-45)" x="-62.131" y="170.94" width="62.744" height="16.631" ry="8.316" />
				<rect transform="rotate(45)" x="147.88" y="22.444" width="62.744" height="16.631" ry="8.316" />
			</g>
		</svg>,
	[IconAssets.check]: (props: ReactSVGProps) =>
		<svg viewBox="0 0 24 24" {...props}>
			<path fill="none" d="M0 0h24v24H0z" />
			<path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" />
		</svg>,
	[IconAssets.close]: (props: ReactSVGProps) =>
		<svg viewBox="0 0 24 24" {...props}>
			<path fill="none" d="M0 0h24v24H0z"/>
			<path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/>
		</svg>,
	[IconAssets.transfer]: (props: ReactSVGProps) =>
		<svg viewBox="0 0 24 24" {...props}>
			<path fill="none" d="M0 0h24v24H0z"/>
			<path d="M12 11V8l4 4-4 4v-3H8v-2h4zm0-9c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 18c4.42 0 8-3.58 8-8s-3.58-8-8-8-8 3.58-8 8 3.58 8 8 8z"/>
		</svg>
}

type IconOptions = {
	size?: string
	color?: string
}

type IconProps = {
	asset: IconAssets
	options?: IconOptions
	style?: React.CSSProperties
	className?: string
	ref?: React.LegacyRef<SVGSVGElement>
}

export default function Icon(props: IconProps) {
	let style = props.style ?? {}
	style.width = props?.options?.size ?? "24px"
	style.height = props?.options?.size ?? "24px"

	return icons[props.asset]({
		className:
			[
				(props.options?.color ?? 'fill-highlight'),
				...([props.className] ?? []),
			].join(' '),
		style: style,
	})
}
