import { Level } from 'level'
import sublevel from 'subleveldown'

// levelDB, sublevel 업데이트 버전 사용방법 적용
const db = new Level('example-db')
const salesDb = db.sublevel('sales', {valueEncoding: 'json'})

export async function totalSales (product) {
    const now = Date.now()
    let sum = 0
    console.log(salesDb)
    for await (const transaction of salesDb.createValueStream()) {
        if (!product || transaction.product === product) {
            sum += transaction.amount
        }
    }

    console.log(`totalSales() took: ${Date.now() - now}ms`)

    return sum
}