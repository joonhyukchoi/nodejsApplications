import { createServer } from 'http'
import { cpus } from 'os'
import cluster from 'cluster'
import { once } from 'events'

// 3rd version
const { pid } = process
const server = createServer((req, res) => {
    // cpu 집약적인 작업
    let i = 1e7
    while ( i > 0 ) { i-- }

    console.log(`Handling request from ${pid}`)
    res.end(`Hello from ${pid}\n`)
})
const port = Number.parseInt(
    process.env.PORT || process.argv[2]
) || 8080
server.listen(8080, () => console.log(`Started at ${pid}`))

/* pm2 명령어
pm2 start app --interpreter none -- --port 8084
*/
// 2nd version
// // cf: cluster.isMaster is deprecated
// if (cluster.isPrimary) {
//     const availableCpus = cpus()
//     console.log(`Clustering to ${availableCpus.length} processes`)
//     availableCpus.forEach(() => cluster.fork())

//     // 오류코드로 종료되는 것을 감지하는 즉시 새로운 작업자 생성
//     cluster.on('exit', (worker, code) => {
//         // 종료 여부 확인
//         if (code !== 0 && !worker.exitedAfterDisconnect) {
//             console.log(
//                 `Worker ${worker.process.pid} crashed. ` +
//                 'Starting a new worker'
//             )
//             cluster.fork()
//         }
//     })

//     // 다운타임 제로 재시작
//     // 작업의 재시작은 SIGUSR2 신호 수신때 트리거
//     // cf: IPC 기법중 하나로 유저 정의 시그날
//     // 시그날을 전송하는 시스템콜인 kill 이용해서 테스트할 것임 
//     process.on('SIGUSR2', async () => {
//         const workers = Object.values(cluster.workers)
//         for (const worker of workers) {
//             console.log(`Stopping worker: ${worker.process.pid}`)
//             // 작업자 중지. 작업자가 현재 요청 처리중인 경우 작업이 완료된 후 중단됨
//             worker.disconnect()
//             await once(worker, 'exit')
//             if (!worker.exitedAfterDisconnect) continue
//             // 프로세스 종료되면 새로운 작업자 생성 가능
//             const newWorker = cluster.fork()
//             // 다음 작업자를 다시 시작하기 전에 새 작업자가 준비되고 새로운 연결을 수신할 때까지 대기
//             await once(newWorker, 'listening')
//         }
//     })
// } else {
//     // 가용성 테스트 위한 무작위 실패조작 구문
//     // setTimeout(
//     //     () => { throw new Error('Ooops') },
//     //     Math.ceil(Math.random() * 3) * 1000
//     // )
//     const { pid } = process
//     const server = createServer((req, res) => {
//         // cpu 집약적인 작업
//         let i = 1e7
//         while ( i > 0 ) { i-- }

//         console.log(`Handling request from ${pid}`)
//         res.end(`Hello from ${pid}\n`)
//     })
//     server.listen(8080, () => console.log(`Started at ${pid}`))
// }

// 1st simple version
// const { pid } = process
// const server = createServer((req, res) => {
//     // cpu 집약적인 작업
//     let i = 1e7
//     while ( i > 0 ) { i-- }

//     console.log(`Handling request from ${pid}`)
//     res.end(`Hello from ${pid}\n`)
// })

// server.listen(8080, () => console.log(`Started at ${pid}`))