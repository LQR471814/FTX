import CancelButton from "components/Misc/CancelButton"
import { transitionEffectOffset } from "lib/Utils"
import { createRef, useEffect } from "react"
import "./css/Overlay.css"

interface Props {
  children: React.ReactChild
  transition: boolean
  onOpen?: Function
  beforeClose?: Function
  onClose?: Function
}

export default function Overlay(props: Props) {
  const overlayDivRef = createRef<HTMLDivElement>()

  const listenForClose = (e: KeyboardEvent) => {
    if (e.code === "Escape") {
      closeRegion()
    }
  }

  const closeRegion = () => {
    document.removeEventListener('keydown', listenForClose)
    if (props.beforeClose) props.beforeClose()

    overlayDivRef.current!.style.opacity = '0%'

    transitionEffectOffset(overlayDivRef.current!, () => {
      if (props.onClose) props.onClose()
    })
  }

  useEffect(() => {
    if (props.transition) {
      overlayDivRef.current!.style.opacity = "100%"
      document.addEventListener('keydown', listenForClose)

      if (props.onOpen) props.onOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="OverlayDiv" ref={overlayDivRef} style={{opacity: (props.transition) ? "0%" : ""}}>
      {props.children}
      {props.transition ? <CancelButton onClick={closeRegion} size={0.03} /> : undefined}
    </div>
  )
}
