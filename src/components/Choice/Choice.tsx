import { createRef, useCallback } from "react"
import "./css/ChoiceOverlay.css"
import "./css/Choice.css"
import "styling/Root.css"
import { setWithoutTransition } from "lib/Utils"

interface Props {
  icon: any
  label: string
  identifier: Primitive
  closeCallback: (identifier: Primitive) => void
  shrink: boolean
}

export default function Choice(props: Props) {
  const iconRef = createRef<any>()
  const tagRef = createRef<HTMLParagraphElement>()

  const textFactor = 0.0175
  const iconFactor = 0.1

  const movePixels = 1000

  const choiceDivRefCallback = useCallback((div) => {
    if (!div) return

    const screenCenterX = window.innerWidth / 2
    const divCenterX = div.getBoundingClientRect().left + div.getBoundingClientRect().width / 2
    const fromCenterLengthFactor = (divCenterX - screenCenterX) / window.innerWidth

    const translateOffset = movePixels * fromCenterLengthFactor

    if (props.shrink) {
      setWithoutTransition(
        div,
        { transform: `translateX(${translateOffset}px)` }
      )

      setTimeout(() => {
        div.style.transform = `translateX(0px)`
      }, 10)

      return
    }

    div.style.transform = `translateX(${translateOffset}px)`
  }, [props.shrink])

  return (
    <div
      className="ChoiceDiv"
      onClick={() => {
        props.closeCallback(props.identifier)
      }}
      ref={choiceDivRefCallback}
    >

      <props.icon
        ref={iconRef}
        style={{
          width: Math.round(
            Math.min(window.innerWidth, window.innerHeight) * iconFactor
          ),
          height: Math.round(
            Math.min(window.innerWidth, window.innerHeight) * iconFactor
          ),
          fill: "",
        }}
      />
      <p
        className="Tag"
        ref={tagRef}
        style={{
          fontSize: Math.round(
            Math.min(window.innerWidth, window.innerHeight) * textFactor
          ),
        }}
      >
        {props.label}
      </p>
    </div>
  )
}
