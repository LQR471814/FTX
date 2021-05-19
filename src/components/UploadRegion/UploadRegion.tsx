import Overlay from 'components/Overlay/Overlay'

import "./css/UploadRegion.css"
import "styling/Widget.css"
import { ChangeEvent, createRef } from 'react'
import { clickElement, refToHTMLElement } from 'lib/Utils'

interface Props {
  onChosen: (files: FileList | null) => void
}

export default function UploadRegion(props: Props) {
  const fileDialogRef = createRef<HTMLInputElement>()

  const onFileChosen = (e: ChangeEvent<HTMLInputElement>) => {
    props.onChosen(e.target.files!)
  }

  return (
    <Overlay transition={true} onClose={() => { props.onChosen(null) }}>
      <div className="UploadFileRoot">
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
