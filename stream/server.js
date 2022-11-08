import { createWriteStream } from 'fs'
import { createServer } from 'net'
import { chunk } from 'underscore'

function demultiplexChannel (source, destinations) {
    let currentChannel = null
    let currentLength = null

    source
        // non-flowing 모드로 스트림 읽기 시작
        .on('readable', () => {
            let chunk
            // 아직 채널ID를 읽지 않았다면 스트림에서 1바이트를 읽어서 숫자로 변환
            if (currentChannel === null) {
                chunk = source.read(1)
                currentChannel = chunk && chunk.readUInt8(0)
            }
            // 데이터의 길이를 읽음. this.read() 호출이 null 을 반환했는데, 아직 데이터 길이만큼을 읽지 못한 경우 파싱을 중단하고,
            // 다음 읽기 가능한 이벤트에서 재시도 할 수 있음
            if (currentLength === null) {
                chunk = source.read(4)
                currentLength = chunk && chunk.readUInt32BE(0)
                if (currentLength === null) {
                    return null
                }
            }

            // 마지막으로 데이터 크기만큼 읽을 수 있는 경우, 내부 버퍼에서 가져올 데이터의 크기를 알고 있으므로 모두 읽음
            chunk = source.read(currentLength)
            if (chunk === null) {
                return null
            }

            console.log(`Received packet from: ${currentChannel}`)
            // 모든 데이터를 읽으면 적절한 목적지 채널에 쓸 수 있으며 currentChannel 및 currentLength 변수를 재 설정했는지 확인함(다음 패킷을 분석하는데 사용)
            destinations[currentChannel].write(chunk)
            currentChannel = null
            currentLength = null
        })
        // 소스 채널이 종료되면 모든 목적지 채널 종료
        .on('end', () => {
            destinations.forEach(destination => destination.end())
            console.log('Source channel closed')
        })
}

const server = createServer((socket) => {
    const stdoutStream = createWriteStream('stdout.log')
    const stderrStream = createWriteStream('stderr.log')
    demultiplexChannel(socket, [stdoutStream, stderrStream])
})

server.listen(3000, () => console.log(`Server started`))