
const log = console.log
const isLetter = (char) => {
    return char in 'abcdefghijklmnopqrstuvwxyz'
}

const ensure = (condition, message) => {
    if(condition) {
        log(message, 'succeed')
    } else {
        log(message, 'failed')
    }
}

module.exports = {
    log,
    ensure,
    
}