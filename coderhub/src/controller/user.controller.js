const userService = require('../service/user.service')

class UserController {
  //   1创建用户
  async createUser(ctx, next){
    // 获取请求参数
    const {name, password} = ctx.request.body;
    // 2. 验证参数
    if (!name ||!password) {
      return ctx.body={
        code:-1001,
        message:'用户名和密码不能为空！',
      }
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
    // 3创建并保存用户
    let result = await userService.create({name, password});
    console.log('result', result)
    ctx.body = {
      message: 'Create user success',
      data: result
    }
  }
}

module.exports = new UserController();
