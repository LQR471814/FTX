import Overlay from 'components/Overlay/Overlay'

import "./css/UploadRegion.css"
import "styling/Widget.css"
import { ChangeEvent, createRef } from 'react'
import { clickElement, refToHTMLElement } from 'lib/Utils'

interface IProps {
  onChosen: (files: FileList) => void
}

export default function UploadRegion(props: IProps) {
  const fileDialogRef = createRef<HTMLInputElement>()

  const onFileChosen = (e: ChangeEvent<HTMLInputElement>) => {
    props.onChosen(e.target.files!)
  }

  return (
    <Overlay show={true}>
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
