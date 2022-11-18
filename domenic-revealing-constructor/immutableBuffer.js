import { Buffer } from 'node:buffer'

const MODIFIER_NAMES = ['swap', 'write', 'fill']

export class ImmutableBuffer {
    constructor (size, executor) {
        const buffer = Buffer.alloc(size)
        // buffer를 변경할 수 있는 함수들을 보관하는 객체 리터럴(modifiers) 생성
        const modifiers = {}
        // 버퍼 내부 속성들을 확인하면서 함수가 아닌 속성은 건너 뜀
        for (const prop in buffer) {
            if (typeof buffer[prop] !== 'function') {
                console.log(prop)
                continue
            }
            // 속성이 함수이면서 MODIFIER_NAMES 배열중 하나인지 확인하면서 현재의 속성이 버퍼를 수정할 수 있는 함수인지 식별
            // 맞다면 buffer 인스턴스에 바인드 한 후 modifier 객체에 추가
            // some은 어떤 요소라도 함수조건 만족하면 true 반환
            // startwith는 말그대로 그 문자로 시작하는지 확인하는 string 메소드
            if (MODIFIER_NAMES.some(m => prop.startsWith(m))) {
                modifiers[prop] = buffer[prop].bind(buffer)
            } else {
                // 함수가 modifier 함수가 아니면 현재 인스턴스(this)에 직접 추가
                this[prop] = buffer[prop].bind(buffer)
            }
        }
        // 생성자에서 입력으로 받은 실행 함수 호출하면서 인자로 modifier 객체 전달 -> 실행 함수가 내부 buffer 변경
        executor(modifiers)
    }
}