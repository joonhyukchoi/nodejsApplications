import { FailsafeSocket } from "./failsafeSocket.js"

const failsafeSocket = new FailsafeSocket({ port: 5000 })

setInterval(() => {
    // 현재 메모리 사용량을 전달
    failsafeSocket.send(process.memoryUsage())
}, 1000)