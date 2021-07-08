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

export default function Banner(props: Props) {
  const onClickClose = () => {
    props.closedCallback()
  }

  const onClickSetup = () => {
    props.callback()
  }

  if (props.show !== true) {
    return <div></div>
  }

  return (
    <div
      className="BannerContainer"
      style={{ backgroundColor: props.backgroundColor }}
    >
      <div style={{
        flex: "1",
        justifyContent: "center",
        marginLeft: "5px"
      }}>
        <span className="BannerMessage" style={{ color: props.textColor }}>
          {props.text}
        </span>

        <button className="Button" onClick={onClickSetup}>
          <span>{props.buttonText}</span>
        </button>
      </div>

      <button onClick={onClickClose} className="CloseButton">
        <CloseIcon />
      </button>
    </div>
  )
}
