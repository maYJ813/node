const crypto = require('crypto')

/**
 * 使用md5  处理用户密码
 */
function md5Password(password) {
    try {
        // md5 hash 算法 更新password ,以16进制 显示
        return crypto.createHash('md5').update(password.toString()).digest('hex')
    }catch (e) {
        console.log('err',e)
    }

}

module.exports = md5Password;