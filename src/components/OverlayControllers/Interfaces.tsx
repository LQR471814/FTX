import ChoicesContainer from "components/Choice/ChoicesContainer"

import { useApp } from "context/AppContext"
import { uniqueId } from "lib/Utils"

import { ReactComponent as OtherIcon } from "styling/assets/other.svg"
import { ReactComponent as WifiIcon } from "styling/assets/interfaceLogos/wifi.svg"
import { ReactComponent as EthernetIcon } from "styling/assets/interfaceLogos/ethernet.svg"

import { NetworkInterface, SetSetupRequest } from "lib/backend_pb"
import { backend } from "context/BackendContext"

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
      const req = new SetSetupRequest()
      const chosenInterface = ctx.state.setupInfo.interfaces.find(
        (i: NetworkInterface) => {
          return i.getIndex() === (intf as number)
        }
      )

      req.setInterface(chosenInterface)
      backend.setSetup(req, null)

      ctx.dispatch({
        type: 'banner_display',
        display: false
      })
    }

    ctx.dispatch({
      type: 'overlay_display',
      overlay: 'networkInterfaces',
      display: false,
      context: null
    })
  }

  return (
    <ChoicesContainer
      mainLabel="Choose a network interface"
      items={
        ctx.state.setupInfo.interfaces.map(
          (intf: NetworkInterface) => {
            const item = {
              label: `${intf.getName()} [${intf.getAddress()}]`,
              icon: OtherIcon,
              identifier: intf.getIndex(),
            }

            if (containsKeywords(intf.getName(), wifiKeywords)) {
              item.icon = WifiIcon
            } else if (containsKeywords(intf.getName(), lanKeywords)) {
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
