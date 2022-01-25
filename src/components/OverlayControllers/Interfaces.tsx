import ChoicesContainer from "components/Choice/ChoicesContainer"

import { useApp } from "context/AppContext"
import { uniqueId } from "lib/Utils"

import { NetworkInterface, SetSetupRequest } from "lib/api/backend_pb"
import { backend } from "lib/Backend"
import { Interface, Primitive } from "lib/apptypes"
import { IconAssets } from "components/Common/Icon"

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
        (i: Interface) => {
          return i.index === (intf as number)
        }
      )

      if (!chosenInterface) {
        console.error("Chosen interface cannot be found in state")
        return
      }

      const reqIntf = new NetworkInterface()
      reqIntf.setIndex(chosenInterface.index)
      reqIntf.setName(chosenInterface.name)
      reqIntf.setAddress(chosenInterface.address)

      req.setInterface(reqIntf)
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
          (intf: Interface) => {
            return {
              label: `${intf.name} [${intf.address}]`,
              icon: containsKeywords(intf.name, wifiKeywords)
                ? IconAssets.i_wifi
                : containsKeywords(intf.name, lanKeywords)
                    ? IconAssets.i_ethernet
                    : IconAssets.i_other,
              identifier: intf.index,
            }
          }
        )
      }
      chosenCallback={chooseInterface}
      componentID={uniqueId("ChoiceContainer")}
    />
  )
}
