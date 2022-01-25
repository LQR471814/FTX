import Icon, { IconAssets } from "components/Common/Icon"
import { MouseEventHandler } from "react"

type Props = {
  size: number
  onClick: MouseEventHandler
}

export default function CancelButton(props: Props) {
  return (
    <div
      className={[
        "centered absolute right-[6%] top-[6%]",
        "p-4 rounded-full outline-none",
        "border-transparent border-solid border-1",
        "transition-all duration-150",
        "hover:scale-110 hover:bg-active hover:bg-opacity-30 hover:cursor-pointer",
        "active:scale-125 active:bg-lightest active:bg-opacity-50 active:border-lightest",
      ].join(' ')}
      onClick={props.onClick}
    >
      <Icon
        asset={IconAssets.thick_close}
        className="fill-highlight-lighter"
        options={{ size: "24px" }}
      />
    </div>
  )
}
