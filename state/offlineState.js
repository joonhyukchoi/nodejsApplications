/* 오프라인에서 소켓의 동작 관리 */
// 해당 라이브러리에서 소켓을 통과하는 JSON 객체 데이터의 구문 분석 및 형식화 처리
import jsonOverTcp from 'json-over-tcp-2'

export class OfflineState {
    constructor (failsafeSocket) {
        this.failsafeSocket = failsafeSocket
    }

    // 큐에 저장해 뒀다가 나중에 전송할 것
    send (data) {
        this.failsafeSocket.queue.push(data)
    }

    activate () {
        const retry = () => {
            setTimeout(() => this.activate(), 1000)
        }

        console.log('Trying to connect...')
        this.failsafeSocket.socket = jsonOverTcp.connect(
            this.failsafeSocket.options,
            () => {
                console.log('Connection established')
                this.failsafeSocket.socket.removeListener('error', retry)
                this.failsafeSocket.changeState('online')
            }
        )
        this.failsafeSocket.socket.once('error', retry)
    }
}