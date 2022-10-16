import path from 'path'
import { URL } from 'url'
import slug from 'slug'
import cheerio from 'cheerio'

export function promisify(callbackBasedApi) {
  return function promisified(...args) {
    // 프라미스 생성자를 사용하여 새로운 프라미스를 생성하고 즉시 호출자에 그것을 반환함
    return new Promise((resolve, reject) => { // (1)
      const newArgs = [
        ...args,
        // 프라미스 생성자에 전달되는 함수에서 callbackBasedApidㅔ 특별한 콜백을 전달.
        // 우리는 콜백이 항상 마지막에 온다는 것을 알고 있으므로 promisified() 함수에 전달되는 인자목록(args)에
        // 콜백을 추가해주기만 하면 됨. 추가한 특별한 콜백에서 에러를 받는다면 즉시 프라미스를 거부하고 그렇지 않다면 주이진 result를 갖고 이행
        function (err, result) {  // (2)
          if (err) {
            return reject(err)
          }

          resolve(result)
        }
      ]
      // 마지막으로 인자목록을 갖고 callbackBasedApi 호출
      callbackBasedApi(...newArgs)  // (3)
    })
  }
}

function getLinkUrl (currentUrl, element) {
  const parsedLink = new URL(element.attribs.href || '', currentUrl)
  const currentParsedUrl = new URL(currentUrl)
  if (parsedLink.hostname !== currentParsedUrl.hostname ||
    !parsedLink.pathname) {
    return null
  }
  return parsedLink.toString()
};

export function urlToFilename (url) {
  const parsedUrl = new URL(url)
  const urlPath = parsedUrl.pathname.split('/')
    .filter(function (component) {
      return component !== ''
    })
    .map(function (component) {
      return slug(component, { remove: null })
    })
    .join('/')
  let filename = path.join(parsedUrl.hostname, urlPath)
  if (!path.extname(filename).match(/htm/)) {
    filename += '.html'
  }

  return filename
}

export function getPageLinks (currentUrl, body) {
  return Array.from(cheerio.load(body)('a'))
    .map(function (element) {
      return getLinkUrl(currentUrl, element)
    })
    .filter(Boolean)
};