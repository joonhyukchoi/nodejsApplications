import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import mkdirp from 'mkdirp'
import { urlToFilename, getPageLinks } from './utils.js'

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
      cb(null, res.text)
    })
  })
}

function spiderLinks (currentUrl, body, nesting, cb) {
  if (nesting === 0) {
    // 3장에서 나오는 Zalgo 참고
    return process.nextTick(cb)
  }

  const links = getPageLinks(currentUrl, body) // [1]
  if (links.length === 0) {
    return process.nextTick(cb)
  }

  function iterate (index) { // [2]
    if (index === links.length) {
      return cb()
    }

    spider(links[index], nesting - 1, function (err) { // [3]
      if (err) {
        return cb(err)
      }
      iterate(index + 1)
    })
  }

  iterate(0) // [4]
}

// 웹 페이지에 포함된 모든 링크 재귀적으로 다운
// ver1에서 파일이 이미 존재하는지 검사하는 대신, 이제 해당 파일에 대한 읽기를 먼저 시도하여 파일 내 링크 수집
export function spider (url, nesting, cb) {
  const filename = urlToFilename(url)
  fs.readFile(filename, 'utf8', (err, fileContent) => {
    if (err) {
      if (err.code !== 'ENOENT') {
        return cb(err)
      }

      // 파일이 존재하지 않기 때문에 다운로드
      return download(url, filename, (err, requestContent) => {
        if (err) {
          return cb(err)
        }

        spiderLinks(url, requestContent, nesting, cb)
      })
    }

    // 파일이 이미 존재하여 링크 처리
    spiderLinks(url, fileContent, nesting, cb)
  })
}