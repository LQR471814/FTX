import {
  deflate
} from 'pako'

onmessage = (e) => {
  const msg = e.data

  switch (msg.type) {
    case 'start':
      const reader = new FileReader()

      reader.addEventListener('progress', (e) => {
        postMessage({
          type: 'read_progress',
          percent: (e.loaded / e.total) * 100
        })
      })

      reader.addEventListener('load', () => {
        postMessage({
          type: 'state',
          message: 'Compressing file...'
        })
        const compressedFileContents = deflate(new Uint8Array(reader.result), {
          level: 1
        })

        postMessage(compressedFileContents)
      })

      postMessage({
        type: 'state',
        message: 'Reading file...'
      })
      reader.readAsArrayBuffer(msg.files[0])
      break
    default:
      postMessage(`Worker got unexpected message type: ${msg.type}`)
  }
}
