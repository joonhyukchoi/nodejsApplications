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
    return process.nextTick(cb)
  }

  const links = getPageLinks(currentUrl, body)
  if (links.length === 0) {
    return process.nextTick(cb)
  }

  let completed = 0
  let hasErrors = false

  function done(err) {
    if (err) {
      hasErrors = true
      return cb(err)
    }
    if (++completed === links.length && !hasErrors) {
      return cb()
    }
  }

  links.forEach(link => spider(link, nesting - 1, done))
}

// race condition 해결 방안으로 해당파일이 존재하면 다운로드 하지 않고 함수를 즉시 종료하도록 조치
const spidering = new Set() // (1)

// ver3는 동시에 많은 요청으로 서버 리소스를 너무 많이 소비하게됨. Dos 가능성도 존재
// 그래서 ver4에서는 제한된 동시실행을 구현
export function spider(url, nesting, queue) {
  if (spidering.has(url)) {
    return
  }
  spidering.add(url)
  queue.pushTask((done) => {  // (2)
    spiderTask(url, nesting, queue, done)
  })
}

function spiderTask (url, nesting, queue, cb) {  // (1)
  if (spidering.has(url)) {
    return process.nextTick(cb)
  }
  spidering.add(url)

  const filename = urlToFilename(url)
  fs.readFile(filename, 'utf8', (err, fileContent) => {
    if (err) {
      if (err.code !== 'ENOENT') {
        return cb(err)
      }

      // 파일이 존재하지 않기 때문에 다운로드
      // race condition 가능성 존재. 비동기 동시성 실행으로 중복되는 파일을 다운로드 할 수 있음
      return download(url, filename, (err, requestContent) => {
        if (err) {
          return cb(err)
        }
        
        spiderLinks(url, requestContent, nesting, queue)  // (2)
        return cb()
      })
    }

    // 이미 파일이 다운로드 되었을 때에도 spiderLinks에 queue 인스턴스를 넘겨줄 필요가 있음
    spiderLinks(url, fileContent, nesting, queue) // (3)
    return cb()
  })
}