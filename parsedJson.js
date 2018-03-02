const jsonTokens = require('./jsonTokens')
const {log, ensure} = require('./utils')
const Type = require('./Type')
const parsedArray = require('./parsedArray')
const parsedObject = require('./parsedObject')

const parsedJson = (tokens) => {
    let json = null
    const length = tokens.length
    let i = 0
    while (i < length) {
        const t = tokens[i]
        if(t.type === Type.bracketLeft) {
            // 处理数组
            const [arr, offset] = parsedArray(tokens, i)
            json = arr
            i = offset
        } else if(t.type === Type.braceLeft) {
            // 处理对象
            const [obj, offset] = parsedObject(tokens, i)
            json = obj
            i = offset
        } else {
            log('Error')
        }
        i += 1
    }
    return json
}

if(require.main === module) {
    
    const code3 = `[{
        "name": "uga",
        "data": [true, 1, false, null]
    }]`
    const ts3 = jsonTokens(code3)
    log('ts3', ts3)
    const js3 = parsedJson(ts3)
    log('json 3', js3)
    
}