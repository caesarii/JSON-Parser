const {log, ensure} = require('./utils')
const jsonTokens = require('./jsonTokens')
const Type = require('./Type')


const parsedArray = (tokens, i) => {
    // i 指向 [
    const arr = []
    // offset 指向第一个数组元素
    let offset = i + 1
    const length = tokens.length
    while(offset < length) {
        const t = tokens[offset]
        const type = t.type
        const value = t.value
        if(type === Type.bracketLeft) {
            const [sub, off] = parsedArray(tokens, offset)
            offset = off
            arr.push(sub)
        } else if(type === Type.bracketRight) {
            // ] 解析完成
            return [arr, offset]
        } else if(type === Type.braceLeft) {
    
            // 解析对象
            const [obj, off] = objEnd(tokens, offset)
            offset = off
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
            arr.push(value)
        } else {
            log('未预期的类型', t)
        }
        
        // 指向下一个字符
        offset += 1
    }
}


module.export = parsedArray

if(require.main === module) {
    // test parsedArray 1
    const code0 = `["name", false, true, null, 123]`
    const ts0 = jsonTokens(code0)
    const [arr0, off0] = parsedArray(ts0, 0)
    log('ts0', ts0)
    log('arr0', arr0)
    
    // test parsed Array 1
    const code1 = `
    [{
        "name": "gua",
        "height": 169,
        "boolean": true,
        "null": null
    },
        true, false, null, 123, "123"
    ]
    `
    const ts1 = jsonTokens(code1)
    const [arr1, off1] = parsedArray(tokens, 0)
    log('ts1', ts1)
    log('arr1', arr1)
    ensure(offset === ts1.length, 'test arr end')

    // const code3 = `[{
    //     "name": "uga",
    //     "data": [true, 1, false, null]
    // }]`
}