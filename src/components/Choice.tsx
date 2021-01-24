import React from "react"
import "../css/MiniComponents.css"
import "../css/ChoiceOverlay.css"
import "../css/Choice.css"

interface IProps {
  icon: any,
  label: string,
  identifier: any,
  closeCallback: Function
}

class Choice extends React.Component<IProps> {
  private iconRef = React.createRef<any>()
  private tagRef = React.createRef<HTMLParagraphElement>()

  private textFactor = 0.015
  private iconFactor = 0.1

  componentDidMount() {
    window.addEventListener("resize", this.updateChoiceSizes)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateChoiceSizes)
  }

  render() {
    return (
      <div
        className="ChoiceDiv"
        onClick={(event) => {
          event.persist()
          if (this.props.identifier === undefined) {
            this.props.closeCallback(this.props.label)
          } else {
            this.props.closeCallback(this.props.identifier)
          }
        }}
      >
        <this.props.icon
          ref={this.iconRef}
          style={{
            width: Math.round(
              Math.min(window.innerWidth, window.innerHeight) * this.iconFactor
            ),
            height: Math.round(
              Math.min(window.innerWidth, window.innerHeight) * this.iconFactor
            ),
          }}
        />
        <p
          className="Tag"
          ref={this.tagRef}
          style={{
            fontSize: Math.round(
              Math.min(window.innerWidth, window.innerHeight) * this.textFactor
            ),
          }}
        >
          {this.props.label}
        </p>
      </div>
    )
  }

  updateChoiceSizes = () => {
    var calc = Math.round(
      Math.min(window.innerWidth, window.innerHeight) * this.iconFactor
    )

    this.iconRef.current!.style.width = calc
    this.iconRef.current!.style.height = calc

    this.tagRef.current!.style.fontSize = Math.round(
      Math.min(window.innerWidth, window.innerHeight) * this.textFactor
    ).toString()
  }
}

export default Choice
