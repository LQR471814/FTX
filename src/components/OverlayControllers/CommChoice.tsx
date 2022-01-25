import ChoicesContainer from "components/Choice/ChoicesContainer";

import { uniqueId } from "lib/Utils";
import { useApp } from "context/AppContext";
import { Primitive } from "lib/apptypes";
import { CommunicateContext } from "lib/CascadingContext";
import { IconAssets } from "components/Common/Icon";

type Props = {
	context: CommunicateContext
}

export default function CommChoice(props: Props) {
	const ctx = useApp()

	return <ChoicesContainer
		mainLabel="Choose what to send"
		items={
			[
				{
					label: "Message",
					icon: IconAssets.message,
					identifier: "MESSAGE"
				},
				{
					label: "File",
					icon: IconAssets.f_default,
					identifier: "FILE"
				},
			]
		}
		chosenCallback={(type: Primitive | undefined) => {
			switch (type) {
				case "MESSAGE":
					ctx.dispatch({
						type: 'group_new',
						peer: props.context.peer,
					})
					break
				case "FILE":
					ctx.dispatch({
						type: 'overlay_display',
						overlay: 'uploadRegion',
						display: true,
						context: props.context,
					})
					break
			}

			ctx.dispatch({
				type: 'overlay_display',
				overlay: 'commChoice',
				display: false,
				context: null
			})
		}}
		componentID={uniqueId("ChoiceContainer")}
	/>
}
