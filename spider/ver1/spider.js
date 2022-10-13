import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import mkdirp from 'mkdirp'
import { urlToFilename } from './utils.js'



// 예시 1. 콜백지옥
// export function spider (url, cb) {
//   const filename = urlToFilename(url)
//   fs.access(filename, err => { // [1]
//     if (err && err.code === 'ENOENT') {
//       console.log(`Downloading ${url} into ${filename}`)
//       superagent.get(url).end((err, res) => { // [2]
//         if (err) {
//           cb(err)
//         } else {
//           mkdirp(path.dirname(filename), err => { // [3]
//             if (err) {
//               cb(err)
//             } else {
//               fs.writeFile(filename, res.text, err => { // [4]
//                 if (err) {
//                   cb(err)
//                 } else {
//                   cb(null, filename, true)
//                 }
//               })
//             }
//           })
//         }
//       })
//     } else {
//       cb(null, filename, false)
//     }
//   })

// 콜백규칙 1. 가능한 빨리 종료 -> else 문 제거 + return 
//  ** 전 **
// if (err) {
//     cb(err)
// } else {
//     // 에러가 없을 때 실행할 코드
// }
//  ** 후 **
// if (err) {
//     return cb(err)
// }
// // 에러가 없을 때 실행할 코드

// 예시 2. 콜백 규칙 적용하여 예시 1 코드를 깔끔하게 작성
function saveFile (filename, contents, cb) {
    mkdirp(path.dirname(filename), err => {
      if (err) {
        return cb(err)
      }
      fs.writeFile(filename, contents, cb)
    })
}

function download (url, filename, cb) {
    console.log(`Downloading ${url}`)
    superagent.get(url).end((err, res) => {
      if (err) {
        return cb(err)
      }
      saveFile(filename, res.text, err => {
        if (err) {
          return cb(err)
        }
        console.log(`Downloaded and saved: ${url}`)
        // 이 cb는 왜있지?
        cb(null, res.text)
      })
    })
}

export function spider (url, cb) {
    const filename = urlToFilename(url)
    fs.access(filename, err => { 
        if (err && err.code === 'ENOENT') { // [1]
            return cb(null, filename, false)
        }
        download(url, filename, err => {
            if (err) {
                return cb(err)
            }
            cb(null, filename, true)
        })
    })
}

