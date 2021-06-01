const FILE_REQUEST_TYPE = "file_requests"
const UPLOAD_CONFIRMATION_TYPE = "upload_confirmation"
const UPLOAD_DENY_TYPE = "upload_deny"
const START_UPLOAD_TYPE = "start_upload"
const TRANSFERRED_CONFIRMATION_TYPE = "transferred_confirmation"

const CHUNK_SIZE = 1024 ** 2 //? 1 mB

let state = 0 //% State: Initial
function changeState(newstate) {
  state = newstate
  console.log(`State: ${state}`)
}

function sendCloseSignal() {
  postMessage({
    type: 'terminate_worker'
  })
}

function updateStatus(message) {
  postMessage({
    type: 'status',
    message: message
  })
}

function sendUploadStartSignal(socket, fileIndex) {
  socket.send(JSON.stringify({
    Type: START_UPLOAD_TYPE,
    Payload: fileIndex.toString()
  }))
}

function uploadFile(socket, f) {
  let currentStart = 0
  let totalSize = f.size

  while (totalSize >= 0) {
    socket.send(f.slice(currentStart, currentStart + CHUNK_SIZE))

    totalSize -= CHUNK_SIZE
    currentStart += CHUNK_SIZE

    postMessage({
      type: 'upload_progress',
      loaded: Math.min(currentStart, f.size), //? Otherwise, you might end up with 150% if the filesize is 1 kB but the chunk size is 1 mB
      total: f.size
    })
  }
}

function constructFileTransferStatus(status_type, payload) {
  return JSON.stringify({
    Type: status_type,
    Payload: JSON.stringify(payload)
  })
}

function constructCumulativeFileRequest(context) {
  return constructFileTransferStatus(FILE_REQUEST_TYPE, {
    From: context.from,
    Files: context.files.map(f => {
      return {
        Filename: f.name,
        Size: f.size,
      }
    })
  })
}

onmessage = (e) => {
  const context = e.data

  switch (context.type) {
    case 'start': //? Event: start
      updateStatus(`Connecting to ${context.targetUser.ip}...`)

      let currentUploadIndex = 0
      const incrementIndex = () => {
        currentUploadIndex += 1
        if (context.files.length === currentUploadIndex) {
          return false
        } else {
          return true
        }
      }

      const uploadSocket = new WebSocket(`ws://${context.targetUser.ip}/sendFile`) //* Action: opw
      changeState(1) //% State: Connecting

      uploadSocket.onopen = () => { //? Event: onopen
        uploadSocket.send(constructCumulativeFileRequest(context)) //* Action: srq
        changeState(2) //% State: Waiting for Confirmation

        updateStatus('Waiting for Approval')
      }

      uploadSocket.onmessage = (e) => {
        const msg = JSON.parse(e.data)

        switch (msg.Type) {
          case UPLOAD_CONFIRMATION_TYPE: //? Event: onacceptrequest
            const f = context.files[currentUploadIndex]
            console.log(currentUploadIndex, context, f)

            sendUploadStartSignal(uploadSocket, currentUploadIndex)
            uploadFile(uploadSocket, f) //* Action: upl
            changeState(3) //% State: Waiting for Upload Complete Confirmation
            updateStatus('Waiting for peer to process data...')

            break
          case UPLOAD_DENY_TYPE: //? Event: ondenyrequest
            updateStatus('Peer Canceled Upload...')

            sendCloseSignal() //* Action: qui
            break
          case TRANSFERRED_CONFIRMATION_TYPE: //? Event: onuploadcomplete
            updateStatus(`Finished transfer of ${msg.Payload}`)

            if (incrementIndex()) { //* Action: inc
              uploadFile(uploadSocket, context.files[currentUploadIndex])
              changeState(3)
            } else {
              updateStatus('Transferred all files successfully!')
              sendCloseSignal() //* Action: qui
            }
            break
          default:
            break
        }
      }

      break
    default:
      postMessage(`Worker got unexpected message type: ${context.type}`)
      break
  }
}