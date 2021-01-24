import React from "react"
import "../css/Banner.css"
import { ReactComponent as CloseIcon } from "../css/assets/close.svg"

interface IProps {
  show: boolean,
  text: string,
  buttonText: string,
  backgroundColor: string,
  textColor: string,
  callback: Function,
  closedCallback: Function
}

class Banner extends React.Component<IProps> {
  onClickClose = () => {
    this.props.closedCallback()
  }

  onClickSetup = () => {
    this.props.callback()
  }

  render() {
    if (this.props.show === true) {
      return (
        <div
          className="BannerContainer"
          style={{ backgroundColor: this.props.backgroundColor }}
        >
          <div style={{ flex: "1", justifyContent: "center" }}>
            <span style={{ color: this.props.textColor }}>
              {this.props.text}
            </span>
            <button className="SetupButton" onClick={this.onClickSetup}>
              {this.props.buttonText}
            </button>
          </div>
          <button onClick={this.onClickClose} className="CloseButton">
            <CloseIcon />
          </button>
        </div>
      )
    } else {
      return <div style={{gridColumn: "1 / -1"}}></div>
    }
  }
}

export default Banner
