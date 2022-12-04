import fs from 'fs'

// 원래 참조값 저장해둠
const originalReadFile = fs.readFile
let mockedResponse = null

function mockedReadFile(path, cb) {
    // 참고: setTimeout이랑 비슷한데 지금과 같이 I/O 주기 내에서는 얘가 먼저 실행됨
    setImmediate(() => {
        cb(null, mockedResponse)
    })
}

export function mockEnable(respondWith) {
    mockedResponse = respondWith
    fs.readFile = mockedReadFile
}

export function mockDisable() {
    fs.readFile = originalReadFile
}