import React, { createRef, useEffect, useState } from "react"
import "./css/ChoiceOverlay.css"
import 'styling/Root.css'
import Overlay from 'components/Overlay/Overlay'
import Choice from "./Choice"
import { refToHTMLElement, transitionEffectOffset } from "lib/TransitionHelper"
import _ from "lodash"

interface Item {
  label: string
  identifier: Primitive
  icon: any
}

interface IProps {
  chosenCallback: (identifier: Primitive | undefined) => void, //? Gets called when an item is chosen
  mainLabel: string, //? The main text at the top of the Choices overlay
  componentID: string, //? distinguish other Choices components from each other
  items: Array<Item>, //? List of items
}

export default function ChoicesContainer(props: IProps) {
  const containerRef = createRef<HTMLDivElement>()
  const closeButtonRef = createRef<HTMLDivElement>()
  const choicesContainerRef = createRef<ChoicesContainer>()

  const [showOverlay, setShowOverlay] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const cancelButtonFactor = 0.03

  //* Because setting the "shrink" state in ChoicesContainer component re-rendered the entire component making all the refs null I decided to put ChoicesContainer div into it's own component
  //* But since I need to change the state on the standalone component without re-passing props (since that'll require a re-render of the entire thing) I tried to use refs to call a function
  class ChoicesContainer extends React.Component<{ componentID: string, items: Array<Item> }, { shrink: boolean }> {
    constructor(props: { componentID: string, items: Array<Item> }) {
      super(props)

      this.state = {
        shrink: true
      }
    }

    setShrink(val: boolean) {
      this.setState({ shrink: val })
    }

    render() {
      return (
        <div className="ChoiceContainer">
          {props.items.map(
            (arrayItem) =>
              <Choice
                key={_.uniqueId(`${props.componentID}_Choice_`)}
                shrink={this.state.shrink}
                label={arrayItem.label}
                icon={arrayItem.icon}
                identifier={arrayItem.identifier}
                closeCallback={closeChoice}
              />
          )}
        </div>
      )
    }
  }

  const onCloseClicked = () => {
    closeChoice(undefined)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Escape") {
      closeChoice(undefined)
    }
  }

  const closeChoice = (id: Primitive | undefined) => {
    document.removeEventListener("keydown", onKeyDown)

    // @ts-ignore
    choicesContainerRef.current!.setShrink(false)

    containerRef.current!.style.transition = "0.2s ease-in all"
    containerRef.current!.style.opacity = "0%"

    transitionEffectOffset(refToHTMLElement(containerRef), () => {
      containerRef.current!.style.transition = ""

      setShowOverlay(false)
      props.chosenCallback(id)
    }, -50)
  }

  useEffect(() => {
    containerRef.current!.style.opacity = "100%"
    document.addEventListener("keydown", onKeyDown)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Overlay show={showOverlay}>
      <div style={{ opacity: "0%", transition: "0.5s ease-in-out all" }} ref={containerRef}>
        <p className="Info">{props.mainLabel}</p>

        <ChoicesContainer
          componentID={props.componentID}
          items={props.items}
          ref={choicesContainerRef}
        />

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
