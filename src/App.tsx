import { useEffect } from "react"
import { useApp } from "context/AppContext"

import Window from "components/Layout/Window/Window"
import ArrayLayout from "components/Layout/Array/Array"

import MessageComponent from "components/MessagePanel/MessageComponent"
import UserList from "components/UserList/UserList"
import TransferStatus from "components/TransferStatus/TransferStatus"
import PendingTransfers from "components/PendingTransfers/PendingTransfers"

import OverlayManager from "components/OverlayControllers/OverlayManager"
import BannerController from "components/Banner/BannerController"

import { initializeBackend } from "context/BackendContext"
import { backend } from "context/BackendContext"
import { Empty, GetSetupResponse, SelfResponse } from "lib/backend_pb"

initializeBackend(document.cookie)

export default function App() {
  const ctx = useApp()

  useEffect(() => {
    backend.getSelf(new Empty(), null).then((res: SelfResponse) => {
      ctx.dispatch({
        type: "self_update",
        hostname: res.getHostname()
      })
    })

    backend.getSetup(new Empty(), null).then((res: GetSetupResponse) => {
      if (res.getRequired() === true) {
        ctx.dispatch({
          type: 'setup_update_netintfs',
          interfaces: res.getInterfacesList()
        })
      }
    })

    //TODO: Come back to this later
    // backendIntf.recvMessage.listen((msg) => {
    //   ctx.dispatch({
    //     type: "message_recv",
    //     msg: msg.Message,
    //     from: msg.User
    //   })
    // })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="AppRoot">
      <ArrayLayout childrenSizes="min-content minmax(0, 1fr)">
        <BannerController />

        <ArrayLayout rows={true}>
          <Window title="Messages">
            <MessageComponent
              groups={ctx.state.messageGroups}
            />
          </Window>

          <ArrayLayout childrenSizes="min-content 1fr">
            <Window title="User List">
              <UserList />
            </Window>

            <ArrayLayout rows={true}>
              <Window title="Pending Transfers">
                <PendingTransfers />
              </Window>
              <Window title="Transfer Status">
                <TransferStatus activeTransfers={
                  Object.values(ctx.state.activeTransfers)
                } />
              </Window>
            </ArrayLayout>
          </ArrayLayout>

        </ArrayLayout>
      </ArrayLayout>

      <OverlayManager />
    </div>
  )
}
