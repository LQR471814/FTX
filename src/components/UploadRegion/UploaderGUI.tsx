import { clickElement, refToHTMLElement } from 'lib/Utils'
import { ChangeEvent, createRef } from 'react'

type Props = {
	onChosen?: (files: FileList | null) => void
}

export default function UploaderGUI(props: Props) {
	const fileDialogRef = createRef<HTMLInputElement>()

	return (
		<div
			className={[
				"flex centered basis-1/2 h-[45%]",
				"transition-all duration-300",
				"bg-lightest bg-opacity-10 rounded-3xl",
				"border-[1px] border-solid border-active",
				"hover:bg-opacity-20 hover:rounded-[2rem]",
				"hover:border-highlight hover:border-2",
				"hover:cursor-pointer",
			].join(' ')}
			onClick={
				() => {
					clickElement(refToHTMLElement(fileDialogRef))
				}
			}>

			<input
				ref={fileDialogRef}
				className="hidden"
				type="file"
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					if (props.onChosen) props.onChosen(e.target.files)
				}}
				multiple
			/>

			<div className="block absolute text-center w-3/12 z-[-1]">
				<p className="font-regular-bold text-4xl text-highlight mb-2">Upload files!</p>
				<p className="font-mono text-xl text-highlight">Drag and drop or click to upload files</p>
			</div>

			<div className={[
				"border-dashed border-4 transition-all duration-150 rounded-[2rem]",
				"w-[calc(100%-50px)] h-[calc(100%-50px)]",
				"hover:w-[calc(100%-70px)] hover:h-[calc(100%-70px)]",
				"active:w-[calc(100%-85px)] active:h-[calc(100%-85px)]",
			].join(' ')} />
		</div>
	)
}
