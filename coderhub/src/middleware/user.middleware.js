const userService = require('../service/user.service')
const {NAME_OR_PASSWORD_IS_REQUIRED, NAME_IS_EXISTS} = require("../config/error");

// user校验
const verifyUser =async(ctx,next)=>{
    // 获取请求参数
    const {name, password} = ctx.request.body;
    // 2. 验证参数
    if (!name ||!password) {
        // return ctx.body={
        //     code:-1001,
        //     message:'用户名和密码不能为空！',
        // }
        return ctx.app.emit('error',NAME_OR_PASSWORD_IS_REQUIRED,ctx);
    }
    //2.2 用户是否存在
    let users =await userService.findUserByName(name);
    console.log('users',users)
    if(users.length > 0){
        // return ctx.body={
        //     code:-1002,
        //     message:'用户名已存在！',
        // }
        return ctx.app.emit('error',NAME_IS_EXISTS,ctx);
    }
    await next();
}
module.exports = {
    verifyUser
}