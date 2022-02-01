import { useEffect } from "react"
import { useApp } from "context/AppContext"

import Window from "components/Layout/Window"
import ArrayLayout from "components/Layout/Array"

import MessageComponent from "components/MessagePanel/MessageComponent"
import UserList from "components/UserList/UserList"
import TransferStatus from "components/Transfer/TransferStatus"
import PendingTransfers from "components/Transfer/PendingTransfers"

import OverlayManager from "components/OverlayControllers/OverlayManager"

import { initializeBackend } from "lib/Backend"
import { backend } from "lib/Backend"
import { Empty, GetSetupResponse, SelfResponse, Message, UsersResponse, TransferRequest, TransferState } from "lib/api/backend_pb"
import { Interface, User, File } from "lib/apptypes"

initializeBackend()

window.addEventListener("beforeunload", () => {
  backend.quit(new Empty(), null)
})

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

    const messages = backend.listenMessages(new Empty())
    messages.on('data', (r: any) => {
      const msg = r as Message

      ctx.dispatch({
        type: 'message_recv',
        from: msg.getAuthor(),
        msg: msg.getContents(),
      })
    })

    const transferRequests = backend.listenIncomingRequests(new Empty())
    transferRequests.on('data', (r: any) => {
      const msg = r as TransferRequest

      const files: File[] = []
      for (const f of msg.getFilesList()) {
        files.push({
          name: f.getName(),
          size: f.getSize(),
          type: f.getType(),
        })
      }

      console.log("New request", msg.getId(), msg.getFrom(), files)

      ctx.dispatch({
        type: 'request_new',
        request: {
          from: msg.getFrom(),
          files: files,
          id: msg.getId()
        }
      })
    })

    const transferStates = backend.listenIncomingStates(new Empty())
    transferStates.on('data', (r: any) => {
      const msg = r as TransferState
      if (msg.getProgress() === 1) {
        setTimeout(() => {
          ctx.dispatch({
            type: 'transfer_remove',
            id: msg.getId()
          })
        }, 3000)
      }

      ctx.dispatch({
        type: 'transfer_update',
        id: msg.getId(),
        state: {
          progress: msg.getProgress(),
          status: "Receiving..."
        }
      })
    })

    const users = backend.listenUsers(new Empty())
    users.on('data', (r: any) => {
      const response = r as UsersResponse

			const users: Record<string, User> = {}
			for (const u of response.getUsersList()) {
				users[u.getIp()] = {
					name: u.getName(),
					ip: u.getIp(),
          fileport: u.getFileport(),
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
    <div className="block h-screen w-screen overflow-auto p-2 box-border">
      {/* <ArrayLayout childrenSizes="min-content minmax(0, 1fr)">
        <BannerController /> */}

      <ArrayLayout rows={true}>
        <Window title="Messages">
          <MessageComponent />
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
              <TransferStatus />
            </Window>
          </ArrayLayout>
        </ArrayLayout>

      </ArrayLayout>
      {/* </ArrayLayout> */}

      <OverlayManager />
    </div>
  )
}
