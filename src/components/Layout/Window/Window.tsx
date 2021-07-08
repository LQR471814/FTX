import "styling/Widget.css"
import "styling/Root.css"
import "./css/Window.css"

interface Props {
  title: string
  children?: React.ReactChild
  col?: boolean
}

export default function Window(props: Props) {
  return (
    <div className="Window" style={{ overflow: "hidden" }}>
      <p className="Title">{props.title}</p>
      {props.children}
    </div>
  )
}
