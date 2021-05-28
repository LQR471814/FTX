import Overlay from 'components/Overlay/Overlay'

import "./css/UploadRegion.css"
import "styling/Widget.css"
import { ChangeEvent, createRef } from 'react'
import { clickElement, refToHTMLElement, transitionEffectOffset } from 'lib/Utils'

interface Props {
  onChosen: (files: FileList | null) => void
}

export default function UploadRegion(props: Props) {
  const fileDialogRef = createRef<HTMLInputElement>()

  const getRootDiv = () => { //? This is a much nicer way of working directly with HTML elements as the REFS THAT I USE WON'T BE NULL!!!
    return document.getElementById('UploadFileRoot')!
  }

  const onFileChosen = (e: ChangeEvent<HTMLInputElement>) => {
    const contentRoot = getRootDiv()

    contentRoot.style.opacity = '0'
    transitionEffectOffset(contentRoot, () => {
      props.onChosen(e.target.files)
    })
  }

  return (
    <Overlay onOpen={() => {
      getRootDiv().style.opacity = '1'
    }} onClose={() => {
      const contentRoot = getRootDiv()

      contentRoot.style.opacity = '0'
      transitionEffectOffset(contentRoot, () => {
        props.onChosen(null)
      })
    }}>
      <div className="UploadFileRoot" id="UploadFileRoot" style={{opacity: '0'}}>
        <input ref={fileDialogRef} type="file" style={{ display: 'none' }} onChange={onFileChosen} multiple />

        <div className="UploadFileRegion"
          onClick={
            () => {
              clickElement(refToHTMLElement(fileDialogRef))
            }
          }>
          <div className="ContentBox">
            <p className="UploadText">Upload files!</p>
            <p className="UploadStipulate">Drag and drop or click to upload files</p>
          </div>
          <div className="UploadFileRegionBorder" />
        </div>
      </div>
    </Overlay>
  )
}
