import { pipeline } from 'stream'
import { createReadStream, createWriteStream } from 'fs'
import split from 'split'
import superagent from 'superagent'
import { ParallelStream } from './parallel-stream.js'
import parallelTransform from 'parallel-transform'
import { request } from 'http'

pipeline(
    createReadStream(process.argv[2]),
    split(),
    // 이 기능은 각 작업에서 청크를 내보내는 동안 버퍼를 사용하여 청크를 재정렬함
    parallelTransform(4, async function (url, done) {
        if (!url) {
            return done()
        }
        console.log(url)
        try {
            // 원래 예제에서는 superagent 사용했는데 why?
            await request.head(url, { timeout: 5 * 1000 })
            this.push(`${url} is up\n`)
        } catch (err) {
            this.push(`${url} is down`)
        }
    }),
    createWriteStream('result.txt'),
    (err) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        console.log('All urls have been checked')
    }
)
// pipeline(
//     // 입력으로 제공된 파일에서 Readable 스트림 생성
//     createReadStream(process.argv[2]),
//     // 입력 파일의 내용을 split를 통해 파이프함. 이는 각 라인이 서로 다른 청크로 방출되도록 하는 Transform 스트림이다
//     split(),
//     new ParallelStream(
//         async (url, enc, push, done) => {
//             if (!url) {
//                 return done()
//             }
//             try {
//                 await superagent.head(url, { timeout: 5 * 1000 })
//                 push(`${url} is up\n`)
//             } catch (err) {
//                 // 요청 응답 없으면 down 표시
//                 push(`${url} is down\n`)
//             }
//             done()
//         }
//     ),
//     createWriteStream('result.txt'),
//     (err) => {
//         if (err) {
//             console.error(err)
//             process.exit(1)
//         }
//         console.log('All urls have been checked')
//     }
// )