import "./css/Banner.css"
import { ReactComponent as CloseIcon } from "styling/assets/close.svg"

type Props = {
  show: boolean
  style: BannerStyle
  click: () => void
  closedCallback: () => void
}

export default function Banner(props: Props) {
  const onClickClose = () => {
    props.closedCallback()
  }

  const onClickSetup = () => {
    props.click()
  }

  if (props.show !== true) {
    return <div></div>
  }

  return (
    <div
      className="BannerContainer"
      style={{ backgroundColor: props.style.backgroundColor }}
    >
      <div style={{
        flex: "1",
        justifyContent: "center",
        marginLeft: "5px"
      }}>
        <span className="BannerMessage" style={{ color: props.style.textColor }}>
          {props.style.text}
        </span>

        <button className="Button" onClick={onClickSetup}>
          <span>{props.style.buttonText}</span>
        </button>
      </div>

      <button onClick={onClickClose} className="CloseButton">
        <CloseIcon />
      </button>
    </div>
  )
}
