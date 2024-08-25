const userService = require('../service/user.service')

class UserController {
  //   1创建用户
  async createUser(ctx, next){
    // 获取请求参数
    const {name, password} = ctx.request.body;
    // 3创建并保存用户
    let result = await userService.create({name, password});
    ctx.body = {
      message: 'Create user success',
      data: result
    }
  }
}

module.exports = new UserController();
