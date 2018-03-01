
// 枚举类型
class Type {
    constructor() {
        this.auto = 0
        this.colon = 1
        this.comma = 2
        this.braceLeft = 3
        this.braceRight = 4
        this.bracketLeft = 5
        this.bracketRight = 6
        this.number = 7
        this.string = 8
        this.token = 9
    }
}

module.exports = new Type()
