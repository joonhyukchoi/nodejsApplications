import { resolve } from 'path'

export function createFSAdapter (db) {
    return ({
        readFile (filename, options, callback) {
            if (typeof options === 'function') {
                callback = options
                options = {}
            } else if (typeof options === 'string') {
                options = { encoding: options }
            }
            // db 인스턴스에서 파일을 검색하려면 파일 이름을 키로 사용해 항상 전체 경로를 사용하도록 해서
            // db.get() 함수를 호출한다.
            db.get(resolve(filename), {
                valueEncoding: options.encoding
            },
            (err, value) => {
                if (err) {
                    if (err.type === 'NotFoundError') {
                        // 데이터베이스에서 키를 찾을 수 없는 경우 ENOENT를 코드로 하여 오류를 생성함
                        // ENOENT 는 No such file or directory랑 동치라 보면 됨
                        err = new Error(`ENOENT, open "${filename}"`)
                        err.code = 'ENOENT'
                        err.errno = 34
                        err.path = filename
                    }
                    return callback && callback(err)
                }
                callback && callback(null, value)
            })
        },
        writeFile (filename, contents, options, callback) {
            if (typeof options === 'function') {
                callback = options
                options = {}
            } else if (typeof options === 'string') {
                options = {encoding: options}
            }

            db.put(resolve(filename), contents, {
                valueEncoding: options.encoding
            }, callback)
        }
    })
}