// LevelUP용 플러그인

export function levelSubscribe (db) {
    db.subscribe = (pattern, listener) => {
        db.on('put', (key, val) => {
            const match = Object.keys(pattern).every(
                k => (pattern[k] === val[k])
            )
            if (match) {
                listener(key, val)
            }
        })
    }
}