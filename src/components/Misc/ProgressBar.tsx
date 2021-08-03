import './css/ProgressBar.css'

type Props = {
	progress: number //? A number from 0 - 100
}

export default function ProgressBar(props: Props) {
	return (
		<div className="Progress-Container">
			<div
				style={{ width: `${props.progress}%` }}
				className="Progress-Child"
			/>
		</div>
	)
}
