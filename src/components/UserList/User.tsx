import { createRef } from "react"

import "./css/UserList.css"

interface IProps {
  onCommChosen: (identifier: Primitive | undefined) => void,
  showCommChoice: Function,
  name: string,
  ip: string
}

export default function User(props: IProps) {
  const userRef = createRef<HTMLDivElement>()

  const onClick = () => {
    props.showCommChoice(props.name)
  }

  return (
    <div ref={userRef} className="User" onClick={onClick}>
      <p className="UserName">{props.name}</p>
      <p className="Ip">{props.ip}</p>
    </div>
  )
}
