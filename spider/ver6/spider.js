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

function spiderLinks(currentUrl, content, nesting, queue) {
  if (nesting === 0) {
    return Promise.resolve()
  }

  const links = getPageLinks(currentUrl, content)
  const promises = links.map(link => spiderTask(link, nesting - 1, queue))

  return Promise.all(promises)
}

const spidering = new Set()
function spiderTask(url, nesting, queue) {
  if (spidering.has(url)) {
    return Promise.resolve()
  }
  spidering.add(url)

  const filename = urlToFilename(url)

  const content = await queue.runTask(async () => {
    try {
      return await fsPromises.readFile(filename, 'utf8')
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err
      }

      // The file doesn't exist, so let’s download it
      return download(url, filename)
    }
  })
  return spiderLinks(url, content, nesting, queue)
}
