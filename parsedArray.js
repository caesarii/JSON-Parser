const {log, ensure} = require('./utils')
const jsonTokens = require('./jsonTokens')
const Type = require('./Type')
exports.done = false
const {done: doneParsedObject, parsedObject} = require('./parsedObject')
// log('Array: doneParsedObject', doneParsedObject)
exports.done = true

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
            if(doneParsedObject) {
                const [obj, off] = parsedObject(tokens, offset)
                exports.done = true
                offset = off
                arr.push(obj)
            }
            
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
            // log('未预期的类型', t)
        }
        
        // 指向下一个字符
        offset += 1
    }
}


exports.parsedArray = parsedArray

if(require.main === module) {
    // test parsedArray 1
    const code0 = `["name", false, true, null, 123]`
    const ts0 = jsonTokens(code0)
    const [arr0, off0] = parsedArray(ts0, 0)
    // log('ts0', ts0)
    log('arr0', arr0)
    // log('test 0', off0, ts0.length)
    ensure(off0 === ts0.length - 1, 'test parsed array 0')
    
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
    const [arr1, off1] = parsedArray(ts1, 0)
    // log('ts1', ts1)
    log('arr1', arr1)
    ensure(off1 === ts1.length - 1, 'test parsed array 1')

    const code2 = `[{
        "name": "uga",
        "data": 12
     }, [true, 1, false, null]]`
    const ts2 = jsonTokens(code2)
    const [arr2, off2] = parsedArray(ts2, 0)
    // log('ts2', ts2)
    log('arr2', arr2)
    ensure(off2 === ts2.length - 1, 'test array 2')
    
    
    const code3 = `[{
        "name": "uga",
        "data": [true, 1, false, null]
    }]`
    const ts3 = jsonTokens(code3)
    // log('ts3', ts3)
    const [arr3, off3] = parsedArray(ts3, 0)
    log('json 3', arr3)
}