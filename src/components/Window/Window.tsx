import "styling/Widget.css"
import "styling/Root.css"
import "styling/Window.css"

interface Props {
  height: string
  title: string
  children?: React.ReactChild
  col?: boolean
}

export default function Window(props: Props) {
  return (
    <div className="Window" style={{ height: props.height, overflow: "hidden" }}>
      <p className="Title">{props.title}</p>
      {props.children}
    </div>
  )
}
