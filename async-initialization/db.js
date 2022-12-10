import { EventEmitter } from 'events'

class DB extends EventEmitter {
    // connected = false
    // commandsQueue = []
    constructor () {
        super()
        this.state = new QueuingState(this)
    }

    // async query (queryString) {
    //     if (!this.connected) {
    //         console.log(`Request queued: ${queryString}`)

    //         return new Promise((resolve, reject) => {
    //             const command = () => {
    //                 this.query(queryString)
    //                     .then(resolve, reject)
    //             }
    //             this.commandsQueue.push(command)
    //         })
    //     }
    //     console.log(`Query executed: ${queryString}`)
    // }

    async query (queryString) {
        return this.state.query(queryString)
    }

    // connect () {
    //     setTimeout(() => {
    //         this.connected = true
    //         this.emit('connected')
    //         this.commandsQueue.forEach(command => command())
    //         this.commandsQueue = []
    //     }, 500)
    // }

    connect () {
        setTimeout(() => {
            this.connected = true
            this.emit('connected')
            const oldState = this.state
            this.state = new InitializedState(this)
            oldState[deactivate] && oldState[deactivate]()
        })
    }
}

export const db = new DB()