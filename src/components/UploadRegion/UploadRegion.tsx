import Overlay from 'components/Overlay/Overlay'

import "./css/UploadRegion.css"
import "styling/Widget.css"

export default function UploadRegion() {


  return (
    <Overlay show={true}>
      <div className="UploadFileContainer">
        <div className="UploadFileRegion">
          <p className="UploadText">Upload files!</p>
        </div>
      </div>
    </Overlay>
  )
}
