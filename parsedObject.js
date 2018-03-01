const {log, ensure} = require('./utils')
const jsonTokens = require('./jsonTokens')
const Type = require('./Type')

// 解析对象
// i 指向 {
// 返回对象和 } 的索引
const parsedObject = (tokens, i) => {
    const obj = {}
    // 指向第一个key
    let offset = i + 1
    const length = tokens.length
    
    while(offset < length) {
        const t = tokens[offset]
        if(t.type === Type.braceRight) {
            // 对象解析结束
            return [obj, offset]
        } else if(t.type === Type.braceLeft) {
            // 不会出现
            log('Error: 错误的 {')
        } else if(t.type === Type.string) {
            // 处理键值对
            // key 不需要处理 type
            const kValue = tokens[offset].value
            // value 需要处理type
            // :
            offset += 1
            // value
            offset += 1
            const v = tokens[offset]
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
            } else if(vType === Type.braceLeft) {
                // 嵌套对象
                log('嵌套对象')
                // offset 当前指向嵌套 {
                const [o, off] = parsedObject(tokens, offset)
                // offset 指向 嵌套 }
                offset = off
                obj[kValue] = o
            } else if(vType === Type.bracketLeft) {
                // 嵌套数组
            }
            offset += 1
        } else {
            offset += 1
        }
    }
}

module.exports = parsedObject

if(require.main === module) {
    // test test parsed object 1
    const code1 = `
    {
            "name": "gua",
            "height": 169,
            "bool": true,
            "null": null
    }
    `
    const ts1 = jsonTokens(code1)
    const [obj1, off1] = parsedObject(ts1, 0)
    log('obj', obj1)
    log('test 1', off1, ts1.length)
    ensure(off1 === ts1.length - 1, 'test obj end')
    
    // test object 2
    const code2 = `{
        "name": "gua",
        "obj": {
            "age": 12
        }
    }`
    
    const ts2 = jsonTokens(code2)
    log('ts2', ts2)
    const [obj2, off2] = parsedObject(ts2, 0)
    log('test obj 2', obj2)
    
    ensure(off2 === ts2.length - 1, 'test obj 2')
}