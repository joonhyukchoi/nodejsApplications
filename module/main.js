import fs, { readFileSync } from 'fs'
import { mockEnable, mockDisable } from './mock-read-file.js'
import { syncBuiltinESMExports } from 'module'

// ** 버퍼에 대해서는 추가 공부 필요 **
mockEnable(Buffer.from('Hello World'))

fs.readFile('fake-path', (err, data) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(data.toString())
})

mockDisable()

fs.readFileSync = () => Buffer.from('Hello, ESM')
// 이 함수를 호출하면 default exports 객체에 있는 속성들의 값이 named exports와 동일한 것으로 매핑됨
syncBuiltinESMExports()

console.log(fs.readFileSync === readFileSync)