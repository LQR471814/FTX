import CancelButton from "components/Common/CancelButton"
import React, { createRef, useEffect } from "react"

type Props = {
  children: React.ReactChild
  onOpen?: Function
  onClose?: Function
  dontHandleClose?: boolean
}

export default function Overlay(props: Props) {
  const overlayDivRef = createRef<HTMLDivElement>()

  const listenForClose = (e: KeyboardEvent) => {
    if (e.code === "Escape") closeRegion()
  }

  const closeRegion = () => {
    if (!props.dontHandleClose)
      document.removeEventListener(
        'keydown',
        listenForClose,
      )

    if (props.onClose) props.onClose()
  }

  useEffect(() => {
    if (!props.dontHandleClose)
      document.addEventListener(
        'keydown',
        listenForClose,
      )

    if (props.onOpen) props.onOpen()

    return () => {
      if (!props.dontHandleClose)
        document.removeEventListener(
          'keydown',
          listenForClose,
        )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={
        [
          "block backdrop-blur-sm h-screen w-screen",
          "fixed left-0 top-0 overflow-y-auto overflow-x-hidden",
          "justify-center transition-all duration-500 z-10"
        ].join(" ")
      }
      ref={overlayDivRef}
    >
      {props.children}
      {!props.dontHandleClose
          ? <CancelButton onClick={closeRegion} size={0.03} />
          : undefined}
    </div>
  )
}
