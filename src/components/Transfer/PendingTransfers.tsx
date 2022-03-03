import ChoiceContainer from "components/Choice/ChoicesContainer"
import Icon, { IconAssets } from "components/Common/Icon"
import { useApp } from 'context/AppContext'
import { TransferChoiceRequest } from "lib/api/backend_pb"
import { File } from 'lib/apptypes'
import { backend } from "lib/Backend"
import { getFileLogo, getFilesizeLabel, refToHTMLElement, transitionEffectOffset } from 'lib/Utils'
import { useRef, useState } from 'react'

function ChoiceButton(
  props: {
    accepting: boolean
    onClick: () => void
  }
) {
  return (
    <div
      className={[
        ...!props.accepting ? ['ml-3'] : [],
        `w-1/2 rounded-md border-1 border-solid justify-center`,
        `shadow-md transition-all`,
        `${
          props.accepting
            ? 'bg-accept'
            : 'bg-deny'
        } bg-opacity-p-default`,
        `${
          props.accepting
          ? 'border-accept'
          : 'border-deny'
        } border-opacity-b-default`,
        `hover:scale-x-105 hover:cursor-pointer`,
        `hover:bg-opacity-p-hover hover:border-opacity-b-hover`,
        `active:bg-opacity-p-active active:border-opacity-b-active`,
      ].join(' ')}
      onClick={props.onClick}
    >
      <Icon
        options={{
          size: "24px",
        }}
        className="fill-highlight"
        asset={
          props.accepting
            ? IconAssets.check
            : IconAssets.close
        }
      />
    </div>
  )
}

function TransferRequestComponent(
  props: {
    onView: () => void
    onChoice: (choice: boolean) => void
    name: string
  }
) {
  const fileHoverRef = useRef<HTMLDivElement>(null)

  return <div className="block relative p-5 wrap">
    <div
      className={[
        "boxover centered backdrop-blur-sm hidden opacity-0",
        "transition-all duration-100",
      ].join(" ")}
      ref={fileHoverRef}
    >
      <span className="title m-0">View Files</span>
      <Icon
        asset={IconAssets.f_default}
        options={{ size: "24px", color: "fill-highlight" }}
      />
    </div>

    <div className="m-0 justify-evenly">
      <span className="title">From {props.name}</span>
    </div>

    <div className="m-0 justify-evenly">
      <ChoiceButton accepting={true} onClick={() => props.onChoice(true)} />
      <ChoiceButton accepting={false} onClick={() => props.onChoice(false)} />
    </div>

    <div
      className="boxover !h-2/5 hover:cursor-pointer"
      onMouseOver={() => {
        if (!fileHoverRef.current) {
          console.error("REF IS NULL!!!!! I HATE REFS")
          return
        }

        Object.assign(
          fileHoverRef.current.style, {
          display: "flex",
          opacity: "1",
        }
        )
      }}
      onMouseOut={() => {
        if (!fileHoverRef.current) {
          console.error("REF IS NULL!!!!! I HATE REFS")
          return
        }

        Object.assign(
          fileHoverRef.current.style,
          { opacity: "0" },
        )

        fileHoverRef.current.style.opacity = "0"
        transitionEffectOffset(
          refToHTMLElement(fileHoverRef),
          (e) => e.style.display = "none"
        )
      }}
      onClick={props.onView}
    />

  </div>
}

export default function PendingTransfers() {
  const ctx = useApp()
  const [viewing, setViewing] = useState<File[] | null>(null);

  return (
    <div className="component-container flex-col">
      {Object.values(ctx.state.transferRequests).map((t, i) => {
        return (
          <TransferRequestComponent
            key={i}
            name={ctx.state.users[t.from].name}
            onChoice={(choice) => {
              const choiceRequest = new TransferChoiceRequest()

              choiceRequest.setAccept(choice)
              choiceRequest.setId(t.id)
              backend.transferChoice(choiceRequest, null)

              ctx.dispatch({
                type: choice ? 'request_accept' : 'request_deny',
                id: t.id
              })
            } }
            onView={() => setViewing(t.files)} />)
      }
      )}

      {
        viewing
          ? <ChoiceContainer
              items={
                viewing.map(f => {
                  return {
                    identifier: f.name,
                    label: `${f.name} (${getFilesizeLabel(f.size)})`,
                    icon: getFileLogo(f.type)
                  }
                })
              }
              mainLabel="Files"
              componentID="FileRequests"
              chosenCallback={(_) => setViewing(null)}
            />
          : null
      }
    </div>
  )
}
