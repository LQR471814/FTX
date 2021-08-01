import { MouseEventHandler, RefObject } from "react"

type Props = {
  size: number
  onClick: MouseEventHandler
  refObj?: RefObject<HTMLDivElement>
}

export default function CancelButton(props: Props) {
  return (
    <div
      className="CancelButton"
      ref={props.refObj}
      style={{
        width: Math.round(
          Math.min(window.innerWidth, window.innerHeight) * props.size
        ),
        height: Math.round(
          Math.min(window.innerWidth, window.innerHeight) * props.size
        ),
        padding: Math.round(
          Math.min(window.innerWidth, window.innerHeight) * 0.0125
        ),
      }}
      onClick={props.onClick}
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
  )
}
