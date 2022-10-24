export class TaskQueue {
    constructor(concurrency) {
        this.taskQueue = []
        this.consumerQueue = []
        // 소비자를 생성
        for (let i = 0; i < concurrency; i++) {
            this.consumer()
        }
    }

    async consumer() {
        while (true) {  // (1) 반복문으로 계속해서 새로운 작업 조회
            try {
                const task = await this.getNextTask()   //  (2) 대기열에서 새로운 작업 조회
                await task()    // (3) 큐가 비어있으면 현재 소비자는 "휴면" 상태로 전환, 휴면 = 이벤트루프에게 제어권 넘어감
            } catch (err) {
                console.log(err)    // (4) 작업에서 발생한 오류로 인해 소비자가 중지되면 안되기 때문에 단순히 로그만 남김
            }
        }
    }
    
    async getNextTask() {
        return new Promise((resolve) => {  
            if (this.taskQueue.length !== 0) {
                return resolve(this.taskQueue.shift())  // (1) 큐가 비어있지 않다면 첫번째 작업가져와서 rosolve 호출, 인자로 전달
            }
            this.consumerQueue.push(resolve) // (2) 비어있다면 consumerQueue에 resolve 콜백을 추가하여 프라미스 해결 연기
        })
    }

    runTask (task) {
        return new Promise((resolve, reject) => {
          const taskWrapper = () => { // (1) 실행 시 입력된 task를 실행하고 task가 반환한 프라미스 상태를 runtask가 반환하는 외부 프라미스로 전달
            const taskPromise = task()
            taskPromise.then(resolve, reject)
            return taskPromise
          }
    
          if (this.consumerQueue.length !== 0) {
            const consumer = this.consumerQueue.shift() // (2) consumerQueue 가 비어있지 않은 경우 대기열에서 끄집어내어 taskWrapper 인자로 바로 호출
            consumer(taskWrapper)
          } else {
            this.taskQueue.push(taskWrapper) // (3) 모든 소비자가 이미 실행중이라면 taskWrapper를 taskQueue에 넣음
          }
        })
      }
}