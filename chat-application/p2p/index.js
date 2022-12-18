import { createServer } from 'http'
import staticHandler from 'serve-handler'
import WebSocket, { WebSocketServer } from 'ws'
import yargs from 'yargs'
// import { Publisher, Subscriber } from 'zeromq'
import zmq from 'zeromq'

const server = createServer((req, res) => {
    return staticHandler(req, res, { public: 'www'})
})

let pubSocket
async function initializeSokcets() {
    pubSocket = new zmq.Publisher()
    await pubSocket.bind(`tcp://127.0.0.1:${yargs.argv.pub}`)
    const subSocket = new zmq.Subscriber()
    const subPorts = [].concat(yargs.argv.sub)
    for (const port of subPorts) {
        console.log(`Subscribing to ${port}`)
        subSocket.connect(`tcp://127.0.0.1:${port}`)
    }
    subSocket.subscribe('chat')

    for await (const [msg] of subSocket) {
        console.log(`Message from another server:${msg}`)
        broadcast(msg.toString().split(' ')[1])
    }
}

initializeSokcets()

const wss = new WebSocketServer({ server })
wss.on('connection', client => {
    console.log('Client connected')
    client.on('message', msg => {
        console.log(`Message: ${msg}`)
        broadcast(msg)
        pubSocket.send(`chat ${msg}`)
    })
})

function broadcast (msg) {
    for (const client of wss.clients) {
        if (client.readyState === ws.OPEN) {
            client.send(msg)
        }
    }
}

server.listen(process.argv.http || 8080)