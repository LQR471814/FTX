import { Component, createRef, useEffect } from "react"
import Overlay from 'components/Overlay/Overlay'
import Choice from "./Choice"
import { refToHTMLElement, transitionEffectOffset } from "lib/Utils"
import { uniqueId } from "lib/Utils"
import CancelButton from "components/Common/CancelButton"
import { Primitive } from "lib/apptypes"
import { IconAssets } from "components/Common/Icon"

type Item = {
  label: string
  identifier: Primitive
  icon: IconAssets
}

type Props = {
  chosenCallback: (identifier: Primitive | undefined) => void //? Gets called when an item is chosen
  mainLabel: string //? The main text at the top of the Choices overlay
  componentID: string //? distinguish other Choices components from each other
  items: Item[] //? List of items
}

export default function ChoicesContainer(props: Props) {
  const rootContainerRef = createRef<HTMLDivElement>()
  const choicesContainerRef = createRef<ChoiceElementsContainer>()

  //* Because setting the "shrink" state in ChoicesContainer component re-rendered the entire component making all the refs null I decided to put ChoicesContainer div into it's own component
  //* But since I need to change the state on the standalone component without re-passing props (since that'll require a re-render of the entire thing) I tried to use refs to call a function
  class ChoiceElementsContainer extends Component<{ componentID: string, items: Array<Item> }, { shrink: boolean }> {
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
        <div
          className={[
            "flex mx-auto mb-[5%] flex-wrap centered",
            "gap-1 max-h-screen w-[95%]",
            "transition-opacity duration-300",
          ].join(' ')}
        >
          {props.items.map(
            (arrayItem) =>
              <Choice
                key={uniqueId(`${props.componentID}_Choice`)}
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

  const listenForClose = (e: KeyboardEvent) => {
    if (e.code === "Escape") {
      closeChoice(undefined)
    }
  }

  const closeChoice = (id: Primitive | undefined) => {
    document.removeEventListener("keydown", listenForClose)

    //? Return if ref is null
    if (!choicesContainerRef.current) return

    // @ts-ignore
    choicesContainerRef.current!.setShrink(false)

    Object.assign(rootContainerRef.current!.style, {
      transition: "0.2s ease-in all",
      opacity: "0%"
    })

    transitionEffectOffset(refToHTMLElement(rootContainerRef), () => {
      rootContainerRef.current!.style.transition = ""

      props.chosenCallback(id)
    }, -50)
  }

  useEffect(() => {
    rootContainerRef.current!.style.opacity = "100%"
    document.addEventListener("keydown", listenForClose)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Overlay dontHandleClose={true}>
      <div className='block opacity-0 transition-all duration-500' ref={rootContainerRef}>
        <p className={[
          'grid-cols-full mt-[12vh] mb-[5vh]',
          'text-center select-none',
          'font-regular-bold text-highlight text-3xl leading-none',
          'min-w-0 min-h-0 break-words max-w-full'
        ].join(' ')}>{props.mainLabel}</p>

        <ChoiceElementsContainer
          componentID={props.componentID}
          items={props.items}
          ref={choicesContainerRef}
        />

        <CancelButton
          size={0.03}
          onClick={() => {
            closeChoice(undefined)
          }}
        />
      </div>
    </Overlay>
  )
}
