import Overlay from 'components/Overlay/Overlay'
import UploaderGUI from './UploaderGUI'
import { transitionEffectOffset } from 'lib/Utils'

type Props = {
  onChosen: (files: FileList | null) => void
}

export default function UploadRegion(props: Props) {
  const getRootDiv = () => { //? This is a much nicer way of working directly with HTML elements as the REFS WON'T BE NULL!!!
    return document.getElementById('upload-region-root')!
  }

  const onFileChosen = (files: FileList | null) => {
    const contentRoot = getRootDiv()

    contentRoot.style.opacity = '0'
    transitionEffectOffset(contentRoot, () => {
      props.onChosen(files)
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
      <div
        className={[
          "flex centered w-full h-full opacity-0",
          "transition-all duration-200",
        ].join(' ')}
        id="upload-region-root"
      >
        <UploaderGUI onChosen={onFileChosen} />
      </div>
    </Overlay>
  )
}
