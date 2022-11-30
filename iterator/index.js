import { Matrix } from './matrix.js'

const matrix2x2 = new Matrix([
    ['11', '12'],
    ['21', '22']
])

const iterator = matrix2x2[Symbol.iterator]()
let iterationResult = iterator.next()
while (!iterationResult.done) {
    console.log(iterationResult.value)
    iterationResult = iterator.next()
}

// 굳이 반복문 while + next 호출 쓸 필요 없이 간단하게 for of 구문으로 반복자 사용 가능
for (const element of matrix2x2) {
    console.log(element)
}

// 전개구문은 반복가능자와 호환됨
const flattenedMatrix = [...matrix2x2]
console.log(flattenedMatrix)

