const {log, } = require('./utils')
const Type = require('./Type.js')

class Token{
    constructor(type, value) {
        // 单字符符号
        const d = {
            ':': Type.colon,
            ',': Type.comma,
            '{': Type.braceLeft,
            '}': Type.braceRight,
            '[': Type.bracketLeft,
            ']': Type.bracketRight
        }
        
        if(type === Type.auto) {
            // 处理单字符符号
            this.type = d[type]
        } else {
            this.type = type
        }
        this.value = value
    }
    log() {
        log(`({${this.value})`)
    }
}

module.exports = Token