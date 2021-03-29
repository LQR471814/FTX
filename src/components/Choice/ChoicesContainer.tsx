import React, { useCallback, useEffect } from "react"
import "./css/ChoiceOverlay.css"
import Overlay from 'components/Overlay/Overlay'
import Choice from "./Choice"

interface Item {
  label: string
  identifier: Primitive
  icon: any
}

interface IProps {
  chosenCallback: (identifier: Primitive) => void, //? Gets called when an item is chosen
  mainLabel: string, //? The main text at the top of the Choices overlay
  columns: number, //? How many columns Choices will have
  show: boolean, //? show Choices or not
  componentID: string, //? distinguish other Choices components from each other
  items: Array<Item>, //? List of items
}

export default function ChoicesContainer(props: IProps) {
  const choiceDivRef = React.createRef<HTMLDivElement>()
  const overlayDivRef = React.createRef<HTMLDivElement>()
  const closeButtonRef = React.createRef<HTMLDivElement>()

  let currentKey = 0
  const cancelButtonFactor = 0.03


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

    Object.assign(choiceDivRef.current!.style, {
      opacity: "50%",
      width: "50%",
      display: "grid"
    })

    new Promise((r) => setTimeout(r, 10)).then(() => {
      Object.assign(choiceDivRef.current!.style, {
        opacity: "100%",
        width: "75%"
      })
    })

  }, [choiceDivRef, closeButtonRef, onKeyDown, overlayDivRef, props.show])


  const closeChoice = async (identifier: Primitive | undefined) => {
    Object.assign(choiceDivRef.current!.style, {
      width: "100%",
      opacity: "50%"
    })

    await new Promise((r) =>
      setTimeout(
        r,
        parseFloat(window.getComputedStyle(choiceDivRef.current!)["transitionDuration"]) * 1000
      )
    )

    choiceDivRef.current!.style.display = "none"

    document.removeEventListener("keydown", onKeyDown)

    if (identifier) props.chosenCallback(identifier)
  }


  return (
    <Overlay show={props.show}>
      <div>
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

          {props.items.map(
            (arrayItem) =>
              <Choice
                key={uniqueKey(`${props.componentID}_Choice_`)}
                label={arrayItem.label}
                icon={arrayItem.icon}
                identifier={arrayItem.identifier}
                closeCallback={closeChoice}
              />
          )}
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
    </Overlay>
  )
}
