// 가져온 코드
// 데이터베이스에 100,000개의 임의 판매 트랜잭션 생성
import { Level } from 'level'
import sublevel from 'subleveldown'
// SyntaxError: The requested module 'nanoid' does not provide an export named 'default
// import nanoid from 'nanoid'
import { nanoid } from 'nanoid'

// levelDB, sublevel 업데이트 버전 사용방법 적용
const db = new Level('example-db')
const salesDb = db.sublevel('sales', { valueEncoding: 'json' })
const products = ['book', 'game', 'app', 'song', 'movie']

async function populate () {
  for (let i = 0; i < 100000; i++) {
    await salesDb.put(nanoid(), {
      amount: Math.ceil(Math.random() * 100),
      product: products[Math.floor(Math.random() * 5)]
    })
  }

  console.log('DB populated')
}

populate()