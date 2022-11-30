// 반복가능자
export class Matrix {
    constructor (inMatrix) {
        this.data = inMatrix
    }

    get (row, column) {
        if (row >= this.data.length ||
            column >= this.data[row].length) {
                throw new RangeError('Out of bounds')
            }
            return this.data[row][column]
    }

    set (row, column, value) {
        if (row >= this.data.length ||
            column >= this.data[row].length) {
                throw new RangeError('Out of bounds')
            }
            this.data[row][column] = value
    }
    // 반복자 반환
    // [Symbol.iterator] () {
    //     let nextRow = 0
    //     let nextCol = 0

    //     return {
    //         next: () => {
    //             if (nextRow === this.data.length) {
    //                 return { done: true }
    //             }

    //             const currVal = this.data[nextRow][nextCol]
    //             if (nextCol === this.data[nextRow].length - 1) {
    //                 nextRow ++
    //                 nextCol = 0
    //             } else {
    //                 nextCol ++
    //             }
    //             return { value: currVal}
    //         }
    //     }
    // }

    // 제너레이터로 구현. @@iterator 함수에 * 을 붙여서 제너레이터로 사용
    * [Symbol.iterator] () {
        // 이전처럼 클로저가 아니라 그냥 로컬 변수. 제너레이터가 호출될 때 재진입 사이에 로컬의 상태가 유지되기 때문에 이렇게 가능
        let nextRow = 0
        let nextCol = 0

        while (nextRow !== this.data.length) {
            yield this.data[nextRow][nextCol]

            if (nextCol === this.data[nextRow].length - 1) {
                nextRow ++
                nextCol = 0
            } else {
                nextCol ++
            }
        }
    }
}