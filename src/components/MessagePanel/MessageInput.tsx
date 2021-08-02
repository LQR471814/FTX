import { transitionEffectOffset } from "lib/Utils"
import { createRef, useState } from "react"
import "./css/MessageInput.css"

type Props = {
	onSubmit: (text: string) => void
}

export default function MessageInput(props: Props) {
	const [msg, setMsg] = useState("")
	const submitButtonRef = createRef<HTMLDivElement>()

	const inputContainerStyle = {
		padding: "10px 5px 5px 5px",
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

		if (e.target.value !== "") {
			setButtonVisibility(true)
		} else {
			setButtonVisibility(false)
		}
	}

	const onEnterPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== "Enter") {
			return
		}

		submit()
	}

	const submit = () => {
		if (msg === "") {
			return
		}

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
		<div className="Block">
			<p className="MessageAuthor">Reply</p>
			<div
				style={inputContainerStyle}
			>

				<input
					tabIndex={-1}
					className="InputField"
					placeholder="Message"
					value={msg}
					onChange={onChange}
					onKeyDown={onEnterPressed}
				/>

				<div
					className="SubmitButton"
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
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 935.31 1080"
						style={{
							fill: "var(--neutral)",
							margin: "auto"
						}}
					>
						<polygon points="935.31 540 0 0 0 1080 935.31 540" />
					</svg>

				</div>
			</div>
		</div>
	)
}
