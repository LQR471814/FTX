import { BannerStyle } from "lib/apptypes"
import Icon, { IconAssets } from "components/Common/Icon"

type Props = {
  show: boolean
  style: BannerStyle
  click: () => void
  closedCallback: () => void
}

export default function Banner(props: Props) {
  if (props.show !== true) {
    return <div></div>
  }

  return (
    <div
      className="flex h-9 rounded-lg m-1 p-1"
      style={{ backgroundColor: props.style.backgroundColor }}
    >
      <div className="flex-1 justify-center ml-1">
        <span className="flex items-center font-regular-bold text-base" style={{ color: props.style.textColor }}>
          {props.style.text}
        </span>

        <button
          className={[
            "mx-1 px-2 rounded-xl",
            "border-2 border-solid border-lightest",
            "text-base leading-none text-lightest",
            "bg-transparent outline-none transitional-all duration-150",
            "hover:text-orange-highlight hover:bg-lightest hover:cursor-pointer"
          ].join(" ")}
          onClick={props.click}
        >
          <span>{props.style.buttonText}</span>
        </button>
      </div>

      <button
        onClick={props.closedCallback}
        className={[
          "relative mx-1 p-0 border-none bg-transparent outline-none group",
          "hover:cursor-pointer"
        ].join(' ')}
      >
        <Icon
          asset={IconAssets.thick_close}
          className="fill-lightest transition-all group-hover:fill-red-highlight"
          options={{ size: "10px" }}
        />
      </button>
    </div>
  )
}
