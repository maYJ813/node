const userService = require('../service/user.service')

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
        return ctx.app.emit('error','name_or_password_is_required',ctx);
    }
    //2.2 用户是否存在
    let users =await userService.findUserByName(name);
    console.log('users',users)
    if(users.length > 0){
        return ctx.body={
            code:-1002,
            message:'用户名已存在！',
        }
    }
    await next();
}
module.exports = {
    verifyUser
}