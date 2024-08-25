const userService = require('../service/user.service')
const {NAME_OR_PASSWORD_IS_REQUIRED, NAME_IS_EXISTS} = require("../config/error");
const md5Password = require("../utils/md5-password");

// user校验
const verifyUser =async(ctx,next)=>{
    // 获取请求参数
    const {name, password} = ctx.request.body;
    // 2. 验证参数
    if (!name ||!password) {
        return ctx.app.emit('error',NAME_OR_PASSWORD_IS_REQUIRED,ctx);
    }
    //2.2 用户是否存在
    let users =await userService.findUserByName(name);
    if(users.length > 0){
        return ctx.app.emit('error',NAME_IS_EXISTS,ctx);
    }
    await next();
}
// 用户密码加密
const handlePassword = async  (ctx,next) => {
    const {password} = ctx.request.body;

    console.log('password',md5Password(password))
    // 加解密 算法
    ctx.request.body.password = md5Password(password);
    // 执行下一个中间件
    await next();
}
module.exports = {
    verifyUser,
    handlePassword
}