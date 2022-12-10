const METHODS_REQUIRING_CONNECTION = ['query']
const deactivate = Symbol('deactivate')

class QueuingState {
    constructor (db) {
        this.db = db
        this.commandQueue = []

        METHODS_REQUIRING_CONNECTION.forEach(methodName => {
            this[methodName] = function (...args) {
                console.log('Command queued:', methodName, args)
                return new Promise((resolve, reject) => {
                    const command = () => {
                        db[methodName](...args)
                        .then(resolve, reject)
                    }
                this.commandQueue.push(command)
                })
            }
        })
    }

    [deactivate] () {
        this.commandQueue.forEach(command => command())
        this.commandQueue = []
    }
}