import React from "react"
import "./css/ChoiceOverlay.css"
import "./css/Choice.css"

interface IProps {
  icon: any,
  label: string,
  identifier: Primitive,
  closeCallback: (identifier: Primitive) => void
}

export default function Choice(props: IProps) {
  const iconRef = React.createRef<any>()
  const tagRef = React.createRef<HTMLParagraphElement>()

  let textFactor = 0.0175
  let iconFactor = 0.1

  // useEffect(() => {
  //   const updateChoiceSizes = () => {
  //     let calc = Math.round(
  //       Math.min(window.innerWidth, window.innerHeight) * iconFactor
  //     )

  //     iconRef.current!.style.width = calc
  //     iconRef.current!.style.height = calc

  //     tagRef.current!.style.fontSize = Math.round(
  //       Math.min(window.innerWidth, window.innerHeight) * textFactor
  //     ).toString()
  //   }

  //   window.addEventListener("resize", updateChoiceSizes)
  //   return () => {
  //     window.removeEventListener("resize", updateChoiceSizes)
  //   }
  // }, [iconFactor, iconRef, tagRef, textFactor])

  return (
    <div
      className="ChoiceDiv"
      onClick={(event) => {
        event.persist()
        props.closeCallback(props.identifier)
      }}
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
