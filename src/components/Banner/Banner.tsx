import "./css/Banner.css"
import { ReactComponent as CloseIcon } from "styling/assets/close.svg"

interface Props {
  show: boolean,
  text: string,
  buttonText: string,
  backgroundColor: string,
  textColor: string,
  callback: Function,
  closedCallback: Function
}

export default function Banner (props: Props) {
  const onClickClose = () => {
    props.closedCallback()
  }

  const onClickSetup = () => {
    props.callback()
  }

  if (props.show === true) {
    return (
      <div
        className="BannerContainer"
        style={{ backgroundColor: props.backgroundColor }}
      >
        <div style={{ flex: "1", justifyContent: "center", marginLeft: "5px" }}>
          <span style={{ color: props.textColor }}>
            {props.text}
          </span>
          <button className="SetupButton" onClick={onClickSetup}>
            {props.buttonText}
          </button>
        </div>
        <button onClick={onClickClose} className="CloseButton">
          <CloseIcon />
        </button>
      </div>
    )
  } else {
    return <div style={{gridColumn: "1 / -1"}}></div>
  }
}
