// import { createWriteStream } from 'fs'
// import { createLoggingWritable } from './logging-writable.js'

// const writable = createWriteStream('test.txt')
// const writableProxy = createLoggingWritable(writable)

// writableProxy.write('First chunk')
// writableProxy.write('Second chunk')
// writable.write('This is not logged')
// writableProxy.end()

import { createObservable } from "./create-observable.js"

function calculateTotal (invoice) {
    return invoice.subtotal - 
        invoice.discount +
        invoice.tax
}

const invoice = {
    subtotal: 100,
    discount: 10,
    tax: 20
}

let total = calculateTotal(invoice)
console.log(`Starting total: ${total}`)

const obsInvoice = createObservable(
 invoice,
 ({ prop, prev, curr }) => {
    total = calculateTotal(invoice)
    console.log(`TOTAL: ${total} (${prop} changed: ${prev} -> ${curr})`)
 }   
)

obsInvoice.subtotal = 200
obsInvoice.discount = 20
obsInvoice.discount = 20
obsInvoice.tax = 30

console.log(`Final total: ${total}`)

