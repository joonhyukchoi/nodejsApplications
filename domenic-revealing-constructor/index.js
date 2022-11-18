import { ImmutableBuffer  } from "./immutableBuffer.js"

const hello = 'Hello!'
// 공개 생성자 패턴에서 대표적인 프로그램은 Javascript의 Promise 클래스이다. resolve(), reject() 함수를 인자로 하는 실행함수를 입력으로 받는다.
const immutable = new ImmutableBuffer(hello.length,
    // ***** 인자 객체의 메소드를 이런식으로 일부만 인자로 받을 수 있구나..
    ({write, swap32}) => {
        console.log('a = ',write, swap32)
    })
console.log(String.fromCharCode(immutable.readInt8(0)))

// 다음과 같은 에러 발생
// "TypeError: immutable.write is not a function"
// immutable.write('Hello?')