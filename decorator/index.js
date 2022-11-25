// import fs from 'fs'
// fs 대신 어댑터 사용 -> 직접 지정한 파일이 아닌 DB를 이용한 저장이 됨
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import level from 'level'
import { createFSAdapter } from './fs-adaptor.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const db = new level.Level(join(__dirname, 'db'), {
    valueEncoding: 'binary'
})
const fs = createFSAdapter(db)
fs.writeFile('file.txt', 'Hello', () => {
    fs.readFile('file.txt', { encoding: 'utf-8' }, (err, res) => {
        if (err) {
            return console.error(err)
        }
        console.log(res)
    })
})

// 일부러 누락된 파일 읽기를 시도
fs.readFile('mmsing.txt', { encoding: 'utf8' }, (err, res) => {
    console.error(err)
})
// import { dirname, join } from 'path'
// import { fileURLToPath } from 'url'
// import level from 'level'
// import { levelSubscribe } from './levelsubscribe.js'

// const __dirname = dirname(fileURLToPath(import.meta.url))
// const dbPath = join(__dirname, 'db')
// // console.log(level.Level)
// const db = new level.Level(dbPath, { valueEncoding: 'json'})
// levelSubscribe(db)

// db.subscribe(
//     { doctype: 'tweet', language: 'en'},
//     (k, val) => console.log(val)
// )

// db.put('1', {
//     doctype: 'tweet',
//     text: 'Hi',
//     language: 'en'
// })

// db.put('2', {
//     doctype: 'company',
//     name: 'ACME Co.'
// })
 