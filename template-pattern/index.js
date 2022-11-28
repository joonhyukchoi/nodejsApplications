import { JsonConfig } from './jsonConfig.js'
import { IniConfig } from './iniConfig.js'

async function main () {
    const jsonConfig = new JsonConfig()
    await jsonConfig.load('samples/conf.json')
    jsonConfig.set('nodejs', '잘하고싶다')
    await jsonConfig.save('samples/conf_mod.json')

    const iniConfig = new IniConfig()
    await iniConfig.load('samples/conf.ini')
    iniConfig.set('nodejs', '잘하고싶다')
    await iniConfig.save('samples/conf_mod.ini')
}

main()