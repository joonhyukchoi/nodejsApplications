import { Transform } from "stream"

export class ParallelStream extends Transform {
    // 생성자에서 userTransform() 함수를 받아 인스턴스 변수로 저장
    constructor (userTransform, opts) {
        // 편의를 위해 객체모드 활성화
        super({ objectMode: true, ...opts })
        this.userTransform = userTransform
        this.running = 0
        this.terminateCb = null
    }
    _transform (chunk, enc, done) {
        this.running++
        this.userTransform(
            chunk,
            enc,
            this.push.bind(this),
            this._onComplete.bind(this)
        )
        // done()을 호출하기 전에 userTransform이 끝나기를 기다리지 않음
        // 반면 this._onComplete() 함수인 userTransform()에 대한 특수한 콜백이 전달됨. 이를 통해 userTransform() 실행이 완료될 때 알림받음
        done()
    }
    // _flush() 함수는 스트림이 종료되기 직전에 호출되므로 아직 작업이 실행중인 경우 done() 콜백을 즉시 호출하지 않음으로써
    // 종료 이벤트를 보류시킬 수 있음. 대신 this.terminateCb 변수에 이를 할당 
    _flush (done) {
        if (this.running > 0) {
            this.terminateCb = done
        } else {
            done()
        }
    }
    // 비동기 작업이 완료될 때마다 호출됨
    // 실행중진 작업이 있는지 확인하고, 작업이 없으면 this.terminateCb() 함수를 호출하여 스트림 종료하고 _flush() 함수에서 보류된 종료이벤트 해제
    _onComplete (err) {
        this.running--
        if (err) {
            return this.emit('error', err)
        }
        if (this.running === 0) {
            this.terminateCb && this.terminateCb()
        }
    }
}