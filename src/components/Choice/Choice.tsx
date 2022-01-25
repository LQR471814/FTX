import { createRef, useCallback } from "react"
import { setWithoutTransition } from "lib/Utils"
import { Primitive } from "lib/apptypes"
import Icon, { IconAssets } from "components/Common/Icon"

type Props = {
  icon: IconAssets
  label: string
  identifier: Primitive
  closeCallback: (identifier: Primitive) => void
  shrink: boolean
}

export default function Choice(props: Props) {
  const tagRef = createRef<HTMLParagraphElement>()

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
      className={
        [
          "flex flex-col text-center break-words items-center",
          "border-2 border-solid border-transparent",
          "max-w-xxs p-5 rounded-xl",
          "transition-all duration-300",
          "hover:!scale-110 hover:cursor-pointer",
          "hover:border-highlight hover:bg-back hover:bg-opacity-20",
        ].join(" ")
      }
      onClick={() => props.closeCallback(props.identifier)}
      ref={choiceDivRefCallback}
    >
      <Icon
        asset={props.icon}
        options={{
          size: "90px",
        }}
        className="fill-highlight-lighter"
       />
      <p className="title pt-5" ref={tagRef}>
        {props.label}
      </p>
    </div>
  )
}
