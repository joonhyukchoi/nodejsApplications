import { createServer } from 'http'
import { cpus } from 'os'
import cluster from 'cluster'

// cf: cluster.isMaster is deprecated
if (cluster.isPrimary) {
    const availableCpus = cpus()
    console.log(`Clustering to ${availableCpus.length} processes`)
    availableCpus.forEach(() => cluster.fork())
} else {
    const { pid } = process
    const server = createServer((req, res) => {
        // cpu 집약적인 작업
        let i = 1e7
        while ( i > 0 ) { i-- }

        console.log(`Handling request from ${pid}`)
        res.end(`Hello from ${pid}\n`)
    })
    server.listen(8080, () => console.log(`Started at ${pid}`))
}
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