const jsonTokens = require('./jsonTokens')
const {log, ensure} = require('./utils')
const Type = require('./Type')

const arrEnd = (tokens, i) => {
    // i 指向 [
    const arr = []
    let offset = i
    const length = tokens.length
    while(offset < length) {
        const t = tokens[offset]
        const type = t.type
        const value = t.value
        
        // 指向下一个字符
        offset += 1
        
        if(type === Type.bracketLeft) {
            // [ 不处理
        } else if(type === Type.bracketRight) {
            // ] 解析完成
            return [arr, offset]
        } else if(type === Type.braceLeft) {
            // 解析对象
            const [obj, off] = objEnd(tokens, offset - 1)
            offset += off
            arr.push(obj)
        } else if(type === Type.number) {
            // 数字
            arr.push(Number(value))
        } else if(type === Type.token) {
            // 处理 关键字 true, false, null
            let temp = ''
            if(value === 'true') {
                temp = true
            } else if(value === 'false') {
                temp = false
            } else if(value === 'null') {
                temp = null
            }
            arr.push(temp)
        } else if(type === Type.string) {
            arr.append(value)
        } else {
            log('未预期的类型')
        }
    }
}

const objEnd = (tokens, i) => {
    const obj = {}
    let offset = i
    const length = len(tokens)
    
    // 对括号进行计数
    const pair = []
    while(offset < length) {
        const t = tokens(offset)
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
    const length = len(tokens)
    let i = 0
    while (i < length) {
        const t = tokens[i]
        if(t.type === Type.bracketLeft) {
            // 处理数组
            const [arr, offset] = arrEnd(tokens, i)
            json = arr
            i += offset
        } else if(t.type === Type.braceLeft) {
            // 处理对象
            const [obj, offset] = objEnd(tokes, i)
            json = obj
            i += offset
        } else {
            i += 1
        }
    }
    return json
}

if(require.main === module) {
    const data = [{
        "name": "gua",
        "height": 169,
        "boolean": true,
        "null": null
    },
        true, false, null, 123, "123"
    ]
    const code1 = `
    ${data}
    `
    const tokens = jsonTokens(code1)
    log('tokens', tokens)
    // const [arr, offset] = arrEnd(tokens, 0)
    // log('arr', arr)
    // ensure(arr == data, 'test arrEnd')
    
}