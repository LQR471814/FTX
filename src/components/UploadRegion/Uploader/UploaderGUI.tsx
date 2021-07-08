import '../css/Uploader.css'
import { clickElement, refToHTMLElement } from 'lib/Utils'
import { ChangeEvent, createRef } from 'react'

interface Props {
	onChosen?: (files: FileList | null) => void
}

export default function UploaderGUI(props: Props) {
	const fileDialogRef = createRef<HTMLInputElement>()

	return (
		<div
			className="UploadFileRegion"
			onClick={
				() => {
					clickElement(refToHTMLElement(fileDialogRef))
				}
			}>

			<input
				ref={fileDialogRef}
				type="file"
				style={{ display: 'none' }}

				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					if (props.onChosen) props.onChosen(e.target.files)
				}}

				multiple
			/>

			<div className="ContentBox">
				<p className="UploadText">Upload files!</p>
				<p className="UploadStipulate">Drag and drop or click to upload files</p>
			</div>

			<div className="UploadFileRegionBorder" />
		</div>
	)
}
