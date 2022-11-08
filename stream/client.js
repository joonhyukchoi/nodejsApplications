import { fork } from 'child_process'
import { connect } from 'net'

function multiplexChannels (sources, destination) {
    let openChannels = sources.length
    for (let i = 0; i < sources.length; i++) {
        sources[i]
            // 각 소스 스트림에 대해 readable 이벤트에 대한 리스너를 등록. 여기서 non-flowing 모드 사용
            .on('readable', function () {
                let chunk
                while ((chunk = this.read()) !== null) {
                    // 청크를 읽으면 채널 ID로 1바이트, 패킷의 크기로 4바이트, 실제 데이터를 순서대로 포함한 패킷으로 묶음
                    const outBuff = Buffer.alloc(1 + 4 + chunk.length)
                    outBuff.writeUInt8(i, 0)
                    outBuff.writeUint32BE(chunk.length, 1)
                    chunk.copy(outBuff, 5)
                    console.log(`Sending packet to channel: ${i}`)
                    destination.write(outBuff)
                }
            })
            // 모든 스트림이 종료되었을 때 목적지 스트림을 종료할 수 있도록 end 이벤트에 대한 리스너 등록
            .on('end', () => {
                if (--openChannels === 0) {
                    destination.end()
                }
            })
    }
}

const socket = connect(3000, () => {
    const child = fork(
        // 경로
        process.argv[2],
        // 자식프로세스에 대한 인자
        process.argv.slice(3),
        // 자식 프로세스가 부모의 stdout 및 stderr를 상속하지 않도록 사일런트 설정
        { silent: true }
    )
    multiplexChannels([child.stdout, child.stderr], socket)
})