import ChoicesContainer from "components/Choice/ChoicesContainer"

import { useApp } from "context/AppContext"
import { uniqueId } from "lib/Utils"

import { ReactComponent as OtherIcon } from "styling/assets/other.svg"
import { ReactComponent as WifiIcon } from "styling/assets/interfaceLogos/wifi.svg"
import { ReactComponent as EthernetIcon } from "styling/assets/interfaceLogos/ethernet.svg"

import * as backend from 'lib/BackendController'

const wifiKeywords = [
  "wi-fi",
  "wifi",
  "wi fi",
  "wlan",
  "wireless",
]

const lanKeywords = [
  "lan",
  "local area network",
  "ethernet",
]

function containsKeywords(str: string, keywords: Array<string>) {
  for (const word of keywords) {
    if (str.toLowerCase().includes(word)) return true
  }
  return false
}

export default function Interfaces() {
	const ctx = useApp()

  // * Callback when user has chosen network interface
  const chooseInterface = (intf: Primitive | undefined) => {
    if (intf !== undefined) {
      backend.resourceSocket.request(
        backend.REQ_SET_INTERFACES,
        { InterfaceID: parseInt(intf as string) }
      )

      ctx.dispatch({
        type: 'banner_toggle'
      })
    }

    ctx.dispatch({
      type: 'overlay_toggle',
      overlay: 'networkInterfaces',
      context: null
    })
  }

	return (
		<ChoicesContainer
			mainLabel="Choose a network interface"
			items={
				ctx.state.setupInfo.netInterfaces.map(
					(intf: NetInterface) => {
						const item = {
							label: `${intf[1]} [${intf[2]}]`,
							icon: OtherIcon,
							identifier: intf[0],
						}

						if (containsKeywords(intf[1], wifiKeywords)) {
							item.icon = WifiIcon
						} else if (containsKeywords(intf[1], lanKeywords)) {
							item.icon = EthernetIcon
						}

						return item
					}
				)
			}
			chosenCallback={chooseInterface}
			componentID={uniqueId("ChoiceContainer")}
		/>
	)
}
