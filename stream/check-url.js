import { pipeline } from 'stream'
import { createReadStream, createWriteStream } from 'fs'
import split from 'split'
import superagent from 'superagent'
import { ParallelStream } from './parallel-stream.js'

pipeline(
    // 입력으로 제공된 파일에서 Readable 스트림 생성
    createReadStream(process.argv[2]),
    // 입력 파일의 내용을 split를 통해 파이프함. 이는 각 라인이 서로 다른 청크로 방출되도록 하는 Transform 스트림이다
    split(),
    new ParallelStream(
        async (url, enc, push, done) => {
            if (!url) {
                return done()
            }
            try {
                await superagent.head(url, { timeout: 5 * 1000 })
                push(`${url} is up\n`)
            } catch (err) {
                // 요청 응답 없으면 down 표시
                push(`${url} is down\n`)
            }
            done()
        }
    ),
    createWriteStream('result.txt'),
    (err) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        console.log('All urls have been checked')
    }
)