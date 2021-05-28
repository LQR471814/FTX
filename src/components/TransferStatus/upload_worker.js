onmessage = (e) => {
  const msg = e.data

  switch (msg.type) {
    case 'start':
      postMessage({
        type: 'state',
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
                type: 'state',
                message: `Compressing ${f.name}...`
              })

              console.log(reader.result)

              resolve(
                {
                  name: f.name,
                  content: new Blob(reader.result)
                }
              )
            })

            reader.readAsArrayBuffer(f)
          }
        )
      })

      Promise.all(filePromises).then((files) => {
        const uploadForm = new FormData()
        for (const f of files) {
          uploadForm.append(f.name, f.content)
        }

        postMessage({
          type: 'state',
          message: 'Preparing to upload file...'
        })

        const sendFileRequest = new XMLHttpRequest()

        sendFileRequest.open('POST', `http://${msg.targetUser.ip}/sendFile`)
        sendFileRequest.onerror = () => {
          postMessage({
            type: 'state',
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
            type: 'state',
            message: 'Upload complete!'
          })
        }

        sendFileRequest.send(uploadForm)
      })

      break
    default:
      postMessage(`Worker got unexpected message type: ${msg.type}`)
      break
  }
}