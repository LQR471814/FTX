import { User as UserType } from 'lib/api/backend_pb'
import { createRef } from "react"

import "./css/UserList.css"

type Props = {
  click: (user: UserType) => void,
  user: UserType
}

export default function User(props: Props) {
  const userRef = createRef<HTMLDivElement>()

  return (
    <div ref={userRef} className="User"
      onClick={() => {
        props.click(props.user)
      }}
    >
      <p className="UserName">{props.user.getName()}</p>
      <p className="Ip">{props.user.getIp()}</p>
    </div>
  )
}
