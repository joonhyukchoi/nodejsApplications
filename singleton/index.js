import { Blog } from './blog.js'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { createDb } from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function main () {
    // 팩토리 함수 createDb()를 사용하여 데이터베이스 종속서(db)을 생성
    const db = createDb(join(__dirname, 'data.sqlite'))
    // Blog 클래스를 인스턴스화 할 때 데이터베이스 인스턴스를 명시적으로 '주입'
    const blog = new Blog(db)
    await blog.initialize()
    const posts = await blog.getAllPosts()
    if (posts.length === 0) {
        console.log('No post available. Run `node import-posts.js`' +
            ` to load some sample posts`)
    }

    for (const post of posts) {
        console.log(post.title)
        console.log('-'.repeat(post.title.length))
        console.log(`published on ${new Date(post.created_at).toISOString()}`)
        console.log(post.content)
    }
}

main().catch(console.error)