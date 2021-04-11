import { createRef, useCallback } from "react"
import "./css/ChoiceOverlay.css"
import "./css/Choice.css"
import "styling/Root.css"
import { setWithoutTransition } from "lib/TransitionHelper"

interface IProps {
  icon: any
  label: string
  identifier: Primitive
  closeCallback: (identifier: Primitive) => void
  shrink: boolean
}

export default function Choice(props: IProps) {
  const iconRef = createRef<any>()
  const tagRef = createRef<HTMLParagraphElement>()
  // const divRef = createRef<HTMLDivElement>()

  const textFactor = 0.0175
  const iconFactor = 0.1

  const movePixels = 1000

  const choiceDivRefCallback = useCallback((div) => {
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

  // useEffect(() => {
  //   setTimeout(() => {
  //     const screenCenterX = window.innerWidth / 2
  //     const divCenterX = divRef.current!.getBoundingClientRect().left + divRef.current!.getBoundingClientRect().width / 2
  //     const fromCenterLengthFactor = (divCenterX - screenCenterX) / window.innerWidth

  //     const translateOffset = movePixels * fromCenterLengthFactor

  //     if (props.shrink) {
  //       setWithoutTransition(
  //         refToHTMLElement(divRef),
  //         { transform: `translateX(${translateOffset}px)` }
  //       )
  //     }

  //     setTimeout(() => {
  //       divRef.current!.style.transform = `translateX(0px)`
  //     }, 10)
  //   }, 10)
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.shrink])

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
