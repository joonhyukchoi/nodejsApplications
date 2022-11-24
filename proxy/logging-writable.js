export function createLoggingWritable(writable) {
    return new Proxy(writable, { // 원래 writable 객체에 대한 프록시를 만들고 반환
        get(target, propKey, receiver) { // get 트랩을 사용하여 객체의 속성에 대한 접근을 가로챔
            if (propKey === 'write') { // 접근한 속성이 write 속성인지 확인. 이 경우 원래 동작의 프록시 함수 반환
                return function (...args) { // 함수에 전달된 인자 목록에서 현재 청크를 추출하고 청크의 내용을 기록한 다음 주어진 인자목록으로 원래 함수 호출
                    const [chunk] = args
                    console.log('Writing', chunk)
                    return writable.write(...args)
                }
            }
            return target[propKey] // 다른 속성에 대해서는 변경없이 반환
        }
    })
}