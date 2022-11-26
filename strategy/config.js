import { promises as fs } from 'fs'
import objectPath from 'object-path'

export class Config {
    constructor (formatStrategy) {
        // data에 환경설정 데이터 보관, 직렬화하는데 사용할 컴포넌트를 나타내는 formatStrategy
        this.data = {}
        this.formatStrategy = formatStrategy
    }

    get (configPath) {
        return objectPath.get(this.data, configPath)
    }

    set (configPath, value) {
        return objectPath.set(this.data, configPath, value)
    }
    // load() 및 save() 함수는 각각 데이터의 직렬화 및 역직렬화를 전략에 위임
    // 즉 생성자에서 입력으로 전달된 formatStrategy에 따라 Config 클래스의 로직이 변경됨
    async load (filePath) {
        console.log(`Deserializing from ${filePath}`)
        this.data = this.formatStrategy.deserialize(
            await fs.readFile(filePath, 'utf-8')
        )
    }

    async save (filePath) {
        console.log(`Serializing to ${filePath}`)
        await fs.writeFile(filePath,
            this.formatStrategy.serialize(this.data))
    }
}