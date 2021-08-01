import { createRef } from "react"

import "./css/UserList.css"

type Props = {
  click: (user: User) => void,
  user: User
}

export default function User(props: Props) {
  const userRef = createRef<HTMLDivElement>()

  const onClick = () => {
    props.click({
      name: props.user.name,
      ip: props.user.ip
    })
  }

  return (
    <div ref={userRef} className="User" onClick={onClick}>
      <p className="UserName">{props.user.name}</p>
      <p className="Ip">{props.user.ip}</p>
    </div>
  )
}
