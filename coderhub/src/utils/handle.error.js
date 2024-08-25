const app = require('../app');

// 错误封装
app.on('error', (error, ctx) => {
    console.log('error', error)
    let code = 0;
    let message = '';
    switch (error) {
        case 'name_or_password_is_required':
            code = -1001;
            message = '用户名和密码不能为空！';
            break;
        default:
    }
    ctx.body = {code, message}
})