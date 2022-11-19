import { throws } from "assert"

// 나누기 연산을 프록시로 하고싶다. 왜냐하면 자바스크립트에서 나누기 0을 하면 Infinite가 반환되는데 명시적 오류를 만들고 싶다.
// Q. 타입스크립트는 어떻게 되어 있을까?
class StackCalculator {
    constructor () {
        this.stack = []
    }

    putValue (value) {
        this.stack.push(value)
    }

    getValue (value) {
        this.stack.pop()
    }

    peekValue () {
        return this.stack[this.stack.length - 1]
    }

    clear () {
        this.stack = []
    }

    divide () {
        const divisor = this.getValue()
        const dividend = this.getValue()
        const result = dividend / divisor
        this.putValue(result)
        return result
    }

    multiply () {
        const multiplicand = this.getValue()
        const multiplier = this.getValue()
        const result = multiplier * multiplicand
        this.putValue(result)
        return result
    }
}

class SafeCalculator {
    constructor (calculator) {
        this.calculator = calculator
    }

    // 프록시 함수
    divide () {
        // 추가적인 검증 로직
        const divisor = this.calculator.peekValue()
        if (divisor === 0) {
            throw Error('Division by 0')
        }
        // Subject에 대한 유효한 위임자(delegate)일 경우
        return this.calculator.divide()
    }

    // 위임된 함수들 
    putValue (value) {
        return this.calculator.putValue(value)
    }

    // 나머지는 귀찮으니 생략.. 어쨋든 다 동일한 함수를 반환하도록 이어줘야함.
}

const calculator = new StackCalculator()
const safeCalculator = new SafeCalculator(calculator)
calculator.putValue(1)
calculator.putValue(0)
console.log(calculator.divide())

safeCalculator.clear()
safeCalculator.putValue(1)
safeCalculator.putValue(0)
console.log(safeCalculator.divide()) // 1 / 0 이 원하는 대로 error 가 나옴

// 하지만 뭔가 불필요한 코드들이 들어가야 한다.
// ES2015부터 지원하는 프록시 객체를 사용해보자

const safeCalculatorHandler = {
    get: (target, property) => {
        if (property === 'divide') {
            // 프록시 된 함수
            return function () {
                // 추가적인 검증 로직
                const divisor = target.peekValue()
                if (divisor === 0) {
                    throw Error('Division by 0')
                }
                // Subject에 대한 유효한 위임자일 경우
                return target.divide()
            }
        }

        // 위임된 함수들과 속성들
        return target[property]
    }
}

// 훨씬 코드양이 줄어들고 가독성이 좋아짐
// 참고로 calculator를 클래스가 아닌 함수와 속성으로 구성해야함
const calculator2 = new StackCalculator()
const safeCalculator2 = new Proxy(
    calculator,
    safeCalculatorHandler
)