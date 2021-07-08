import CancelButton from "components/Misc/CancelButton"
import React, { createRef, useEffect } from "react"
import "./css/Overlay.css"

interface Props {
  children: React.ReactChild
  onOpen?: Function
  onClose?: Function
  dontHandleClose?: boolean
}

export default function Overlay(props: Props) {
  const overlayDivRef = createRef<HTMLDivElement>()

  const listenForClose = (e: KeyboardEvent) => {
    if (e.code === "Escape") {
      closeRegion()
    }
  }

  const closeRegion = () => {
    if (!props.dontHandleClose) document.removeEventListener('keydown', listenForClose)

    if (props.onClose) props.onClose()
  }

  useEffect(() => {
    if (!props.dontHandleClose) document.addEventListener('keydown', listenForClose)

    if (props.onOpen) props.onOpen()

    return () => {
      if (!props.dontHandleClose) document.removeEventListener('keydown', listenForClose)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="OverlayDiv" ref={overlayDivRef}>
      {props.children}
      {!props.dontHandleClose ? (<CancelButton onClick={closeRegion} size={0.03} />) : undefined}
    </div>
  )
}
