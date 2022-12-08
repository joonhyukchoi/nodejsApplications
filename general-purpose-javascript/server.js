import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import react from 'react'
import reactServer from 'react-dom/server.js'
import htm from 'htm'
import fastify from 'fastify'
import fastifyStatic from 'fastify-static'
import { StaticRouter, matchPath } from 'react-router-dom'
import { routes } from './frontend/routes.js'
import { App } from './frontend/App.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const html = htm.bind(react.createElement)

// 
const template = ({ content, serverData }) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>My library</title>
  </head>
  <body>
    <div id="root">${content}</div>
    ${serverData ? `<script type = "text/javascript>
    window.__STATIC_CONTEXT__=${JSON.stringify(serverData)}
    </script>` : ''}
    <script type="text/javascript" src="/public/main.js"></script>
  </body>
</html>`
// fastify 서버 인스턴스 생성, 로깅 활성화
const server = fastify({ logger: true }) 

// 웹 애플리케이션은 /public/main.js 스크립트 로드, 이 파일은 웹팩에 의해 생성되는 프론트엔드 번들
// 여기서는 fastify 서버 인스턴스가 fastify-static 플러그인을 사용하여 public 폴더의 모든 정적 파일들을 서비스하도록 함
server.register(fastifyStatic, {
  root: resolve(__dirname, '..', 'public'),
  prefix: '/public/'
})

// 서버에 대한 모든 GET 요청을 가로채는 catch-all 라우트 정의
// catch-all 라우트를 정의하는 이유는 실제 라우팅 로직이 이미 React 애플리케이션에 포함되어 있기 때문
// React 애플리케이션이 렌더링할 때 현재 URL을 기반으로 적절한 페이지 컴포넌트를 표시함
server.get('*', async (req, reply) => {
  const location = req.raw.originalUrl
  let component
  let match
  for (const route of routes) {
    component = route.component
    // match에는 매칭된 정보 포함. ex) 경로에 포함된 params 정보
    match = matchPath(location, route)
    if (match) {
      break
    }
  }

  let staticData
  let staticError
  let hasStaticContext = false
  if (typeof component.preloadAsyncData === 'function') {
    hasStaticContext = true
    try {
      const data = await component.preloadAsyncData({ match })
      staticData = data
    } catch (err) {
      staticError = err
    }
  }
  const staticContext = {
    [location]: {
      data: staticData,
      err: staticError
    }
  }
  // 서버측에서 react-router-dom의 staticRouter 인스턴스를 사용하여 애플리케이션의 컴포넌트를 감싸야 함
  // StaticRouter는 서버 측 렌더링에 사용할 수 있는 React Router 버전임
  // 이 라우터는 브라우저 윈도우에서 현재의 URL을 획득하지 않고 location 속성을 통해 서버로부터 직접 현재 URL을 전달할 수 있음
  const serverApp = html` 
    <${StaticRouter}
      location=${location}
      context=${staticContext}
    >
      <${App}/>
    </>
  `
  // renderToString() 함수를 사용하여 serverApp 컴포넌트에 대한 HTML 코드를 생성할 수 있음
  // 생성된 HTML은 주어진 URL에서 클라이언트 측 애플리케이션에 의해 생성한 HTML과 동일함
  // 다음 몇 줄에서는 template() 함수를 사용하여 페이지 템플릿으로 생성된 HTML코드인 content를 감싸고 그 결과를 클라이언트에 전송
  const content = reactServer.renderToString(serverApp)
  const serverData = hasStaticContext ? staticContext : null
  const responseHtml = template({ content, serverData })

  const code = staticContext.statusCode ? staticContext.statusCode : 200
  reply.code(code).type('text/html').send(responseHtml)
})

// Fastify 서버 인스턴스가 localhost:3000인 기본 주소와 포트에서 요청을 수신하도록 지정
const port = Number.parseInt(process.env.PORT) || 3000
const address = process.env.ADDRESS || '127.0.0.1'

server.listen(port, address, function (err) {
  if (err) {
    console.error(err)
    process.exit(1)
  }
})