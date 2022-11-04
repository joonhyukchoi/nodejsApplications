import { createServer } from 'http'
import { createWriteStream } from 'fs'
import { createGunzip } from 'zlib'
import { basename, join } from 'path'

/* 압축된 리퀘스트 데이터를 받아서 수신하는 순간 부터 압축해제하고 서버 파일시스템에 저장
    만약 버퍼링으로 구현했다면 모든 데이터를 수신하고 나서 해제를 시작. */
const server = createServer((req, res) => {
    const filename = basename(req.headers['x-filename'])
    const destFilename = join('received_files', filename)
    console.log(`File request received: ${filename}`)
    req
        .pipe(createGunzip())
        .pipe(createWriteStream(destFilename))
        .on('finish', () => {
            res.writeHead(201, { 'Content-Type': 'text/plain' })
            res.end('OK\n')
            console.log(`File saved: ${destFilename}`)
        })
})

server.listen(3000, () => console.log('Listening on http://localhost:3000'))