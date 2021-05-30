onmessage = (e) => {
  const msg = e.data

  switch (msg.type) {
    case 'start':
      postMessage({
        type: 'status',
        message: 'Starting task...'
      })

      const filePromises = Array.from(msg.files).map(f => {
        const reader = new FileReader()

        reader.addEventListener('progress', (e) => {
          postMessage({
            type: 'read_progress',
            loaded: e.loaded,
            total: e.total
          })
        })

        return new Promise(
          resolve => {
            reader.addEventListener('load', () => {
              postMessage({
                type: 'status',
                message: `Processing ${f.name}...`
              })

              resolve(
                {
                  name: f.name,
                  content: new Blob([reader.result])
                }
              )
            })

            reader.readAsArrayBuffer(f)
          }
        )
      })

      Promise.all(filePromises).then((files) => {
        const maxFormSize = 850000 //? ~850 kB (at least for chrome)
        const contentSize = Math.round(maxFormSize / files.length)

        const uploadForm = new FormData()

        for (const f of files) {
          uploadForm.append(f.name, f.content.slice(0, contentSize))
        }

        postMessage({
          type: 'status',
          message: 'Preparing to upload file...'
        })

        const sendFileRequest = new XMLHttpRequest()

        sendFileRequest.onerror = () => {
          postMessage({
            type: 'status',
            message: `Upload failed with code: ${sendFileRequest.status}`
          })
        }
        sendFileRequest.upload.progress = (e) => {
          postMessage({
            type: 'upload_progress',
            loaded: e.loaded,
            total: e.total
          })
        }
        sendFileRequest.upload.onload = (e) => {
          postMessage({
            type: 'status',
            message: 'Upload complete!'
          })
          postMessage({
            type: 'terminate_worker'
          })
        }

        sendFileRequest.open('POST', `http://${msg.targetUser.ip}/sendFile`)
        sendFileRequest.send(uploadForm)
      })

      break
    default:
      postMessage(`Worker got unexpected message type: ${msg.type}`)
      break
  }
}