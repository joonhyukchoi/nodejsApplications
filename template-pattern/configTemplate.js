// 템플릿 패턴은 그냥 인터페이스 만들고 자식클래스에서 상세구현을 하는 그냥 일반적인 객체지향 패턴인거같음
// 전략패턴과의 차이는 전략은 런타임에 동적으로 가변부분이 변경되는 것이고 템플릿은 클래스가 정의되는 순간 결정됨
import { promises as fsPromises } from 'fs'
import objectPath from 'object-path'

export class ConfigTemplate {
    async load (file) {
        console.log(`Deserializing from ${file}`)
        this.data = this._deserialize(
            await fsPromises.readFile(file, 'utf-8')
        )
    }
    // 읽을 때는 읽고 파싱하고, 쓸 때는 파싱하고 쓰고
    async save (file) {
        console.log(`Serializing to ${file}`)
        await fsPromises.writeFile(file, this._serialize(this.data))
    }

    get (path) {
        return objectPath.get(this.data, path)
    }

    set (path, value) {
        return objectPath.set(this.data, path, value)
    }

    _serialize () {
        throw new Error('_serialize() must be implemented')
    }

    _deserialize () {
        throw new Error('_deserialize() must be implemented')
    }
}