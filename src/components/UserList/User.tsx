import { User } from "lib/apptypes"
import { createRef } from "react"

type Props = {
  click: (user: User) => void,
  user: User
}

export default function UserComponent(props: Props) {
  const userRef = createRef<HTMLDivElement>()

  return (
    <div
      ref={userRef}
      className={[
        "block m-1 px-4 py-2 rounded-xl bg-dark",
        "transition-all",
        "hover:bg-neutral hover:cursor-pointer",
        "hover:border-2 hover:border-solid hover:border-highlight"
      ].join(' ')}
      onClick={() => {
        props.click(props.user)
      }}
    >
      <p className="font-regular-bold std-text">{props.user.name}</p>
      <p className="font-mono std-text">{props.user.ip}</p>
    </div>
  )
}
