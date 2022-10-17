// ver 2를 프로미스로 변경한 모듈
import fs from 'fs'
import superagent from 'superagent'
import mkdirp from 'mkdirp'
import { urlToFilename, getPageLinks } from './utils.js'
import {promises as fsPromises } from 'fs' // (1) 이미 프라미스화된 fs 함수들에 접근하기 위해서 fs 모듈의 promises객체를 임포트
import { dirname } from 'path'
import { promisify } from 'util'

const mkdirpPromises = promisify(mkdirp)  // (2) mkdirp() 함수는 직접 프라미스로 변환

function download (url, filename, cb) {
  console.log(`Downloading ${url}`)
  let content
  return superagent.get(url)
    .then((res) => {
      content = res.text
      return mkdirpPromises(dirname(filename))
    })
    .then(() => fsPromises.writeFile(filename, content))
    .then(() => {
      console.log(`Downloaded and saved: ${url}`)
      return content
    })
}

function spiderLinks (currentUrl, body, nesting, cb) {
  let promise = Promise.resolve()
  if (nesting === 0) {
    return promise
  }
  const links = getPageLinks(currentUrl, content)
  for (const link of links) {
    promise = promise.then(() => spider(link, nesting - 1))
  }
}

/* 아래 함수를 사용하면 병렬 실행
function spiderLinks(currentUrl, content, nesting) {
  if (nesting === 0) {
    return Promise.resolve()
  }
  const links = getPageLinks(currentUrl, content)
  const promises = links.map(link => spider(link, nesting - 1))

  return Promise.all(promises)\
}
*/

export function spider (url, nesting, cb) {
  const filename = urlToFilename(url)
  return fsPromises.readFile(filename, 'utf8')
    .catch((err) => {
      if (err.code !== 'ENOENT') {
        throw err
      }

      // 파일이 존재하지 않아, 다운로드 시작
      return download(url, filename)
    })
    .then(content => spiderLinks(url, content, nesting))
}