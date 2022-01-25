type Props = {
	progress: number //? A number from 0 - 100
}

export default function ProgressBar(props: Props) {
	return (
		<div className="block w-full h-2 rounded-lg overflow-hidden bg-neutral-lighter">
			<div
				style={{ width: `${props.progress * 100}%` }}
				className="block w-0 h-full bg-active transition-all"
			/>
		</div>
	)
}
