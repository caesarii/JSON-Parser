const jsonTokens = require('./jsonTokens')
const {log, ensure} = require('./utils')
const Type = require('./Type')

const objEnd = (tokens, i) => {
    const obj = {}
    let offset = i
    const length = tokens.length
    
    while(offset < length) {
        const t = tokens[offset]
        if(t.type === Type.braceRight) {
            // 对象解析结束
            return [obj, offset]
        } else if(t.type === Type.braceLeft) {
            offset += 1
        } else if(t.type === Type.string) {
            // 处理键值对
            // key 不需要处理 type
            const kValue = tokens[offset].value
            // value 需要处理type
            const v = tokens[offset + 2]
            vValue = v.value
            vType = v.type
            
            if(vType === Type.number) {
                obj[kValue] = Number(vValue)
            } else if(vType === Type.token) {
                let temp = ''
                if(vValue === 'true') {
                    temp = true
                } else if(vValue === 'false') {
                    temp = false
                } else if(vValue === 'null') {
                    temp = null
                } else {
                    log('未预期的关键字')
                }
                obj[kValue] = temp
            } else if(vType === Type.string) {
                obj[kValue] = vValue
            }
            offset += 3
        } else {
            offset += 1
        }
    }
}

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
            const [obj, offset] = objEnd(tokens, i)
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
    
    
    
    // test obj end
    const code2 = `
    {
            "name": "gua",
            "height": 169,
            "bool": true,
            "null": null
    }
    `
    const tokens2 = jsonTokens(code2)
    const [obj, offset2] = objEnd(tokens, 0)
    log('obj', obj)
    ensure(offset2 === tokens2.length, 'test obj end')
    
    // test parsed json
    
    const json = parsedJson(tokens)
    log('json', json)
    
    const json2 = parsedJson(tokens2)
    log('json 2', json2)
    
    
    const code3 = `[{
        "name": "uga",
        "data": [true, 1, false, null]
    }]`
    const ts3 = jsonTokens(code3)
    const js3 = parsedJson(ts3)
    log('json 3', js3)
    
}