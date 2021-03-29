import React from 'react'
import "./css/Overlay.css"

interface IProps {
  children: React.ReactChild
  show: boolean
}

export default function Overlay(props: IProps) {
  const overlayDivRef = React.createRef<HTMLDivElement>()

  let divStyle = { display: "none", backdropFilter: "none" }

  if (props.show) divStyle = { display: "block", backdropFilter: "blur(4px)" }

  return (
    <div className="OverlayDiv" ref={overlayDivRef} style={{ ...divStyle }}>
      {props.children}
    </div>
  )
}
