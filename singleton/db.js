// import { dirname, join } from 'path'
// import { fileURLToPath } from 'url'
// import sqlite3 from 'sqlite3'
// const __dirname = dirname(fileURLToPath(import.meta.url))
// export const db = new sqlite3.Database(
//     join(__dirname, 'data.sqlite')
// )

import sqlite3 from 'sqlite3'

export function createDb (dbFile) {
    return new sqlite3.Database(dbFile)
}