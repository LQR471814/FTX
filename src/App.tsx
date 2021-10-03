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

import { initializeBackend } from "lib/Backend"
import { backend } from "lib/Backend"
import { Empty, GetSetupResponse, Message, SelfResponse, UsersResponse } from "lib/api/backend_pb"

initializeBackend()

export default function App() {
  const ctx = useApp()

  useEffect(() => {
    backend.getSelf(new Empty(), null).then((res: SelfResponse) => {
      console.log(res)

      ctx.dispatch({
        type: "self_update",
        hostname: res.getHostname()
      })
    })

    backend.getSetup(new Empty(), null).then((res: GetSetupResponse) => {
      console.log(res)

      if (res.getRequired() === true) {
        ctx.dispatch({
          type: "banner_display",
          display: true
        })

        const intfList: Interface[] = res.getInterfacesList().map(i => {
          return {
            index: i.getIndex(),
            name: i.getName(),
            address: i.getAddress()
          }
        })

        ctx.dispatch({
          type: 'setup_update_netintfs',
          interfaces: intfList
        })
      }
    })

    const messageStream = backend.listenMessages(new Empty())
    messageStream.on('data', (r: any) => {
      const msg = r as Message
      console.log(msg)

      ctx.dispatch({
        type: "message_recv",
        from: msg.getAuthor()!.getIp(),
        msg: msg.getContents(),
      })
    })

    const userStream = backend.listenUsers(new Empty())
    userStream.on('data', (r: any) => {
      const response = r as UsersResponse

			const users: Record<string, User> = {}
			for (const u of response.getUsersList()) {
				users[u.getIp()] = {
					name: u.getName(),
					ip: u.getIp(),
				}
			}

      ctx.dispatch({
        type: "peers_set",
        users: users
      })
    })

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
