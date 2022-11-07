import { createWriteStream, createReadStream } from 'fs'
import { Readable, Transform } from 'stream'

export function concatFiles (dest, files) {
    return new Promise((resolve, reject) => {
        const destStream = createWriteStream(dest)
        // 파일 배열에서 Readable 스트림 생성
        Readable.from(files)
            .pipe(new Transform({
                // true = 문자열 수신
                objectMode: true,
                // 각 파일에 대해 Readable 스트림을 만들어 파일 내용을 읽고 destStream(대상 파일에 대한 writable 스트림)으로 파이프함
                transform (filename, enc, done) {
                    const src = createReadStream(filename)
                    // end: false 하여 소스 파일 읽기가 완료된 후에도 destStream을 닫지 않도록 함
                    src.pipe(destStream, { end: false })
                    src.on('error', done)
                    // 소스 파일의 모든 내용이 destStream 으로 파이프되면, done 함수를 호출하여 현재 처리의 완료를 알림. 이는 다음 파일의 처리를 시작시키는데 필요
                    src.on('end', done)
                }
            }))
            .on('error', reject)
            // 모든 파일이 처리되면 종료 이벤트 발생
            .on('finish', () => {
                destStream.end()
                resolve()
            })
    })
}