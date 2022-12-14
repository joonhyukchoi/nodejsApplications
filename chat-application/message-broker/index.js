import { createServer } from 'http'
import staticHandler from 'serve-handler'
import WebSocket, { WebSocketServer } from 'ws'
import Redis from 'ioredis'
import { channel } from 'diagnostics_channel'

const redisSub = new Redis()
const redisPub = new Redis()

const server = createServer((req, res) => {
    // 모든 요청을 특수핸들러로 전달하고 www 디렉터리에서 모든 정적 파일 처리
    return staticHandler(req, res, { public: 'www'})
})

const wss = new WebSocketServer({ server })
wss.on('connection', client => {
    console.log('Client connected')
    client.on('message', msg => {
        console.log(`Message: ${msg}`)
        // broadcast(msg)
        redisPub.publish('chat_messages', msg)
    })
})

redisSub.subscribe('chat_messages')
redisSub.on('message', (channel, msg) => {
    for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg)
        }
    }
})
// function broadcast (msg) {
//     for (const client of wss.clients) {
//         if (client.readyState === ws.OPEN) {
//             client.send(msg)
//         }
//     }
// }

server.listen(process.argv[2] || 8080)