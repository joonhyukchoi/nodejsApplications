import { Config } from "./config.js"
import { jsonStrategy, iniStrategy } from "./strategies.js"

async function main() {
    const iniConfig = new Config(iniStrategy)
    await iniConfig.load('conf.ini')
    iniConfig.set('책 거의 다봐감', 'design patterns')
    await iniConfig.save('conf_mod,ini')

    const jsonConfig = new Config(jsonStrategy)
    await jsonConfig.load('conf.json')
    jsonConfig.set('노드 마스터하자', 'design patterns')
    await jsonConfig.save('conf_mod.json')
}

main()