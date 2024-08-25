const app = require('../app');
const {NAME_OR_PASSWORD_IS_REQUIRED, NAME_IS_EXISTS} = require("../config/error");

// 错误封装
app.on('error', (error, ctx) => {
    let code = 0;
    let message = '';
    switch (error) {
        case NAME_OR_PASSWORD_IS_REQUIRED:
            code = -1001;
            message = '用户名和密码不能为空！';
            break;
        case NAME_IS_EXISTS:
            code = -1002;
            message = '用户已经存在！';
            break;
        default:
    }
    ctx.body = {code, message}
})