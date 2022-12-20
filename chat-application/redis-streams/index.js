import { createServer } from 'http'
import staticHandler from 'serve-handler'
import ws from 'ws'
import Redis from 'ioredis'

const redisClient = new Redis()
const redisClientXRead = new Redis()

const server = createServer((req, res) => {
    return staticHandler(req, res, { public: 'www' })
})

const wss = new ws.Server({ server })
wss.on('connections', async client => {
    console.log('Client connected')

    client.on('message', msg => {
        console.log(`Message: ${msg}`)
        redisClient.xadd('chat_stream', '*')
    })

    const logs = await redisClient.xrange(
        'chat_stream', '-', '+'
    )
    for (const [, [, meesage]] of logs) {
        client.send(msg)
    }
})

function broadcast (msg) {
    for (const client of wss.clients) {
        if (client.readyState === ws.OPEN) {
            client.send(msg)
        }
    }
}

let lastRecordId = '$'

async function processStreamMessage () {
    while (true) {
        const [[, records]] = await redisClientXRead.xread(
            'BLOCK', '0', 'STREAMS', 'chat_stream', lastRecordId
        )
        for (const [recordID, [, message]] of records) {
            console.log(`Message from stream: ${message}`)
            broadcast(message)
            lastRecordId = recordID
        }
    }
}

processStreamMessage().catch(err => console.error(err))

server.listen(process.argv[2] || 8080)