import React from 'react'

type Props = {
	children: React.ReactChild[]
	rows?: boolean
	childrenSizes?: string
}

export default function ArrayLayout(props: Props) {
	const rootStyle: any = {}
	rootStyle[
		`gridTemplate${props.rows ? 'Columns' : 'Rows'}`
	] = props.childrenSizes ?
		props.childrenSizes :
		`repeat(${props.children.length}, 1fr)`

	return (
		<div className="grid h-full" style={rootStyle}>
			{props.children}
		</div>
	)
}
