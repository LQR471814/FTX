import ChoicesContainer from "components/Choice/ChoicesContainer";

import { ReactComponent as FileIcon } from "styling/assets/file.svg"
import { ReactComponent as MessageIcon } from "styling/assets/message.svg"

import { uniqueId } from "lib/Utils";
import { useApp } from "context/AppContext";

type Props = {
	context: CommunicateContext
}

export default function CommChoice(props: Props) {
	const ctx = useApp()

	return (
		<ChoicesContainer
			mainLabel="Choose what to send"
			items={
				[
					{ label: "Message", icon: MessageIcon, identifier: "MESSAGE" },
					{ label: "File", icon: FileIcon, identifier: "FILE" },
				]
			}
			chosenCallback={(type: Primitive | undefined) => {
				switch (type) {
					case "MESSAGE":
						ctx.dispatch({
							type: 'group_new',
							id: props.context.id,
						})
						break
					case "FILE":
						ctx.dispatch({
							type: 'overlay_toggle',
							overlay: 'uploadRegion'
						})
						break
				}

				ctx.dispatch({
					type: 'overlay_toggle',
					overlay: 'commChoice'
				})
			}}
			componentID={uniqueId("ChoiceContainer")}
		/>
	)
}
