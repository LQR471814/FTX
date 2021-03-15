import React, { useCallback, useEffect } from "react"
import "./css/ChoiceOverlay.css"
import Choice from "./Choice"

interface IProps {
  chosenCallback: Function,
  labelLogic: Function,
  mainLabel: string,
  columns: number,
  show: boolean,
  componentID: string,
  icons: Array<any>,
  items: Array<any>
}

export default function ChoicesContainer(props: IProps) {
  const choiceDivRef = React.createRef<HTMLDivElement>()
  const overlayDivRef = React.createRef<HTMLDivElement>()
  const closeButtonRef = React.createRef<HTMLDivElement>()

  let currentKey = 0
  let cancelButtonFactor = 0.03

  const uniqueKey = (prefix: string) => {
    currentKey++
    return prefix + currentKey.toString()
  }

  const onCloseClicked = () => {
    closeButtonRef.current!.className += " Active"
    closeChoice(undefined)
  }

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === "Escape") {
      var evObj = document.createEvent("Events")
      evObj.initEvent("click", true, false)

      closeButtonRef.current!.dispatchEvent(evObj)
    }
  }, [closeButtonRef])

  useEffect(() => {
    if (!props.show) {
      return
    }

    document.addEventListener("keydown", onKeyDown)

    document.getElementById("AppGrid")!.style.transition = "none"
    document.getElementById("AppGrid")!.style.filter = "blur(4px)"

    choiceDivRef.current!.style.opacity = "50%"
    choiceDivRef.current!.style.width = "50%"

    choiceDivRef.current!.style.display = "grid"
    overlayDivRef.current!.style.display = "block"

    new Promise((r) => setTimeout(r, 10)).then(() => {
      choiceDivRef.current!.style.opacity = "100%"
      choiceDivRef.current!.style.width = "75%"
    })
  }, [choiceDivRef, closeButtonRef, onKeyDown, overlayDivRef, props.show])

  const closeChoice = async (identifier: any) => {
    document.getElementById("AppGrid")!.style.transition = "all 0.25s"
    document.getElementById("AppGrid")!.style.filter = "none"

    choiceDivRef.current!.style.width = "100%"
    choiceDivRef.current!.style.opacity = "50%"

    await new Promise((r) =>
      setTimeout(
        r,
        parseFloat(window.getComputedStyle(choiceDivRef.current!)["transitionDuration"]) * 1000
      )
    )

    choiceDivRef.current!.style.display = "none"
    overlayDivRef.current!.style.display = "none"

    document.removeEventListener("keydown", onKeyDown)

    props.chosenCallback(identifier)
  }

  return (
    <div className="OverlayDiv" ref={overlayDivRef}>
      <p className="Info">{props.mainLabel}</p>
      <div
        className="ChoiceContainer"
        ref={choiceDivRef}
        style={{
          gridTemplateColumns:
            "repeat(" + props.columns.toString() + ", 1fr)",
          display: "none",
        }}
      >
        {props.items.map((arrayItem) => {
          var itemLabels = props.labelLogic(arrayItem)
          return (
            <Choice
              key={uniqueKey(`${props.componentID}_Choice_`)}
              label={itemLabels.label}
              icon={itemLabels.icon}
              closeCallback={closeChoice}
              identifier={itemLabels.identifier}
            />
          )
        })}
      </div>
      <div
        className="CancelButton"
        ref={closeButtonRef}
        style={{
          width: Math.round(
            Math.min(window.innerWidth, window.innerHeight) *
            cancelButtonFactor
          ),
          height: Math.round(
            Math.min(window.innerWidth, window.innerHeight) *
            cancelButtonFactor
          ),
          padding: Math.round(
            Math.min(window.innerWidth, window.innerHeight) * 0.0125
          ),
        }}
        onClick={onCloseClicked}
        onTransitionEnd={(e) => {
          if ((e.target as HTMLDivElement).className === "CancelButton Active") {
            (e.target as HTMLDivElement).className = "CancelButton"
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-0.1988677978515625 -0.006744384765625 128.79347229003906 128.74560546875"
        >
          <path
            className="cls-1"
            d="M311.07,420.94l48.09-48.08a9.53,9.53,0,0,0,0-13.43h0a9.52,9.52,0,0,0-13.44,0l-48.08,48.08-48.09-48.08a9.51,9.51,0,0,0-13.43,0h0a9.51,9.51,0,0,0,0,13.43l48.08,48.08L236.12,469a9.5,9.5,0,1,0,13.43,13.43l48.09-48.08,48.08,48.08A9.5,9.5,0,1,0,359.16,469Z"
            transform="translate(-233.35 -356.66)"
          ></path>
        </svg>
      </div>
    </div>
  )
}
