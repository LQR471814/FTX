import React, { ReactChild } from 'react'
import "styling/Widget.css"
import "styling/Root.css"
import "styling/Window.css"

interface IProps {
  height: string
  title: string
  children?: ReactChild
  col?: boolean
}

export default function Window(props: IProps) {
  return (
    <div className="Window" style={{ height: props.height, overflow: "hidden" }}>
      <p className="Title">{props.title}</p>
      {props.children}
    </div>
  )
}
