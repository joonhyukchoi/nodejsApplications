/* 온라인에서 소켓의 동작 관리 */

export class OnlineState {
    constructor (failsafeSocket) {
        this.failsafeSocket = failsafeSocket
        this.hasDisconnected = false
    }

    send (data) {
        this.failsafeSocket.queue.push(data)
        this._safeWrite(data)
    }

    _safeWrite (data) {
        this.failsafeSocket.socket.write(data, (err) => {
            if (!this.hasDisconnected && !err) {
                this.failsafeSocket.queue.shift()
            }
        })
    }
    // 함수가 오프라인일 때 대기열에 있던 모든 데이터를 비움. 그리고 소켓이 오프라인되면 에러메시지가 수신되고 오프라인상태로 전환
    activate () {
        this.hasDisconnected = false
        for (const data of this.failsafeSocket.queue) {
            this._safeWrite(data)
        }

        this.failsafeSocket.socket.once('error', () => {
            this.hasDisconnected = true
            this.failsafeSocket.changeState('offline')
        })
    }
}