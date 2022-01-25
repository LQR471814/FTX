import { transitionEffectOffset } from "lib/Utils"
import { createRef, useState } from "react"

type Props = {
	onSubmit: (text: string) => void
}

export default function MessageInput(props: Props) {
	const [msg, setMsg] = useState("")
	const submitButtonRef = createRef<HTMLDivElement>()

	const inputContainerStyle = {
		padding: "10px 2px 5px 2px",
		overflow: "hidden",
	}

	const submitButtonStyle = {
		shown: {
			margin: "0px 4px 0px 8px",
			padding: "10px 5px 10px 5px",
		},
		hidden: {
			margin: "0px",
			padding: "0px",
		},

		widths: {
			shown: "40px",
			hidden: "0px"
		},

		normalColoring: {
			backgroundColor: "#45bbff",
			color: "#ffffff",
			border: ""
		},
		submittedColoring: {
			backgroundColor: "#96fa60",
			border: "1px solid white"
		},
	}

	const setButtonVisibility = (
		visibility: boolean,
		element?: HTMLDivElement
	) => {
		let button = submitButtonRef.current!
		if (element) button = element

		if (visibility === true) {
			Object.assign(button.style, submitButtonStyle.shown)

			transitionEffectOffset(button, (element) => {
				element.style.width = submitButtonStyle.widths.shown
			}, -100)
			return
		}

		Object.assign(button.style, {
			...submitButtonStyle.normalColoring,
			width: submitButtonStyle.widths.hidden,
		})

		transitionEffectOffset(button, (element) => {
			Object.assign(element.style, submitButtonStyle.hidden)
		}, -100)
	}

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMsg(e.target.value)
		setButtonVisibility(e.target.value.length > 0)
	}

	const onEnterPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== "Enter") return
		submit()
	}

	const submit = () => {
		if (msg === "") return

		setMsg("")
		props.onSubmit(msg)

		//Reset Button
		Object.assign(
			submitButtonRef.current!.style,
			submitButtonStyle.submittedColoring
		)

		transitionEffectOffset(submitButtonRef.current!, (element) => {
			setButtonVisibility(false, element as HTMLDivElement)
		})
	}

	return (
		<div style={inputContainerStyle}>
			<input
				tabIndex={-1}
				className={[
					"font-mono text-sm text-lightest",
					"p-2.5 w-full rounded-xl bg-neutral-light",
					"drop-shadow transition-all",
					"outline-none border-none",
					"placeholder:text-white",
					"focus:border-2 focus:border-solid focus:border-dark",
				].join(" ")}
				placeholder="Message"
				value={msg}
				onChange={onChange}
				onKeyDown={onEnterPressed}
			/>

			<div
				className={[
					"outline-none centered",
					"rounded-xl overflow-hidden transition-all duration-100",
					"hover:cursor-pointer hover:border-2 hover:border-solid hover:border-lightest",
					"active:border-2 active:bg-accept",
				].join(" ")}
				onClick={submit}
				ref={submitButtonRef}
				style={{
					...submitButtonStyle.normalColoring,
					width: submitButtonStyle.widths.hidden
				}}
			>
				<svg
					width="13px"
					height="13px"
					viewBox="0 0 935.31 1080"
					className="fill-neutral"
					style={{
						margin: "auto"
					}}
				>
					<polygon points="935.31 540 0 0 0 1080 935.31 540" />
				</svg>
			</div>
		</div>
	)
}
