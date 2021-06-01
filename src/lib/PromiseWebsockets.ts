export class AwaitableSocket {
    _socket: WebSocket

    constructor(url: string) {
        this._socket = new WebSocket(url)
    }

    waitForConnection() {
        return new Promise(resolve => {
            this._socket.onopen = (e) => {
                resolve(e)
            }
        })
    }

    recv() {
        return new Promise(resolve => {
            this._socket.onmessage = (e) => {
                resolve(e)
            }
        })
    }

    send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
        this._socket.send(data)
    }
}