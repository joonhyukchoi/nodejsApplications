import { FindRegex } from './FindRegex.js'

const findRegexInstance = new FindRegex(/hello \w+/)
findRegexInstance
    .addFile('fileA.txt')
    .addFile('fileB.json')
    .find()
    .on('found', (file, match) => console.log(`Matched "${match}" in file ${file}`))
    .on('error', err => console.error(`Error emitted ${err.message}`))