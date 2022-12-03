export const jsonMiddleware = function () {
    return {
        // 메시지 역직렬화
        inbound (message) {
            return JSON.parse(message.toString())
        },
        // 문자열로 직렬화
        outbound (message) {
            return Buffer.from(JSON.stringify(message))
        }
    }
}