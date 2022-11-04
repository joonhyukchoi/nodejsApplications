/* 스트림을 이용한 방식. 수 기가 사이즈의 큰 파일도 작동 가능 */
import { createReadStream, createWriteStream } from 'fs'
import {createGzip } from 'zlib'

const filename = process.argv[2]

createReadStream(filename)
    .pipe(createGzip())
    .pipe(createWriteStream(`${filename}.gz`))
    .on('finish', () => console.log('File successfully compressed'))

/* 버퍼링을 사용한 압축 방식 */
/* 수 기가 정도의 큰 파일을 압축하고자 하면 버퍼 크기 초과 에러 뜨면서 실행이 안됨 */
// import { promises as fs } from 'fs'
// import { gzip } from 'zlib'
// import { promisify } from 'util'
// const gzipPromise = promisify(gzip)

// const filename = process.argv[2]

// async function main () {
//     const data = await fs.readFile(filename)
//     const gzippedData = await gzipPromise(data)
//     await fs.writeFile(`${filename}.gz`, gzippedData)
//     console.log('File successfully compressed')
// }

// main()