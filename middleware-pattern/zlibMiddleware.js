import { inflateRaw, deflateRaw } from 'zlib'
import { promisify } from 'util'

const inflateRawAsync = promisify(inflateRaw)
const deflateRawAsync = promisify(deflateRaw)

export const zlibMiddleware = function () {
    return {
        // inbound 일 때 해제
        inbound (message) {
            return inflateRawAsync(Buffer.from(message))
        },
        // outbound 일 때 압축
        outbound (message) {
            return deflateRawAsync(message)
        }
    }
}