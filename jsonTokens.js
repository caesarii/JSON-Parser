
const {log, ensure, found, isLetter, isNumber} = require('./utils')
const Type = require('./Type')
const Token = require('./Token')

// 查找字符串结尾的函数
// 返回字符串和字符串结尾 " 的索引
// index 是字符串开始的 " 的索引
const stringEnd = (code, index) => {
    let s = ''
    let offset = index + 1
    while(offset < code.length) {
        const c = code[offset]
        if(c === '"') {
            // 找到字符串结尾
            return [s, offset]
        } else if(c === '\\') {
            // 处理转义字符
            const next = code[offset + 1]
            if(next === '"') {
                s += '"'
                offset += 2
            } else if(next === '\t') {
                s += '\t'
                offset += 2
            } else if(next === '\n') {
                s += '\n'
                offset += 2
            } else if(next === '\\') {
                s += '\\'
                offset += 2
            } else {
                // 非法转义字符
                log('非法转义字符')
            }
        } else {
            // 普通字符
            s += c
            offset += 1
        }
    }
    print('程序出错，没有反引号')
}

// 查找数字结尾的函数
// 返回数字和最后一个数字的索引
// index 是第一个数字的索引
const numberEnd = (code, index) => {
    // 第二个数字
    offset = index + 1
    while(isNumber(code[offset])) {
        offset += 1
    }
    return [code.slice(index, offset), offset - 1]
}

// 查找关键词结尾的函数， 参数和返回值与上面相同
const keywordEnd = (code, index) => {
    const kwd = ['true', 'false','null']
    // 第一个字符
    let sub = code[index]
    // 第二个字符
    let offset = index + 1
    while(isLetter(code[offset])) {
        sub += code[offset]
        offset += 1
    }
    
    // 验证是否是关键字
    const key = code.slice(index, offset)
    if(kwd.indexOf(key) === -1) {
        log('Error: keywordEnd 不是预定义的关键字')
    }
    
    return [key, offset - 1]
}

const jsonTokens = (code) => {
    const length = code.length
    const tokens = []
    // 回车 换行 制表符 空格
    const spaces = '\r\n\t '
    const symbols = ':,{}[]'
    // 关键字 true, false, null
    const keywords = 'tfn'
    
    let i = 0
    while(i < length) {
        const c = code[i]
        // i 指向下一个字符
        // i += 1
        // log('c', c)
        if(found(c, spaces)) {
            // 跳过空白符
            
        } else if(found(c, symbols)) {
            // 单字符符号
            const  t = new Token(Type.auto, c)
            tokens.push(t)
        } else if(c === '"') {
            // 字符串
            // i 指向字符串
            const [s, offset] = stringEnd(code, i)
            i = offset
            const t = new Token(Type.string, s)
            tokens.push(t)
        } else if(isNumber(c)) {
            // 处理数字
            // const end = 0
            const [n, offset] = numberEnd(code, i)
            i = offset
            const t = new Token(Type.number, n)
            tokens.push(t)
        } else if(found(c, keywords)) {
            const [key, offset] = keywordEnd(code, i)
            i = offset
            const t = new Token(Type.token, key)
            tokens.push(t)
        } else {
            //
            log('Error: 非预期的字符', c.charCodeAt(0))
        }
        // i 指向下一个字符
        i = i + 1
    }
    
    return tokens
}

module.exports = jsonTokens

if(require.main === module) {
    
    // test string end
    const str1 = '"12345"123false'
    const [ts1, i] = stringEnd(str1, 0)
    ensure(ts1 === '12345' && i === 6, 'test string end')

    // test number end
    const [ts2, j] = numberEnd(str1, 7)
    ensure(ts2 === '123' && j === 9, 'test number end')
    
    // test keyword end
    const [ts3, k] = keywordEnd(str1, 10)
    ensure(ts3 === 'false' && k === 14, 'test keyword end')
    
    // test json tokens
    const code = `
    {
        "n\\\"ame": "gua",
      "h\\\teight": 169,
      "b\\\nool": false,
      "n\\\\ull": null
    }`
    
    const ts = jsonTokens(code)
    ts.forEach(t => t.log())
    log('json tokens 1', ts)
}
