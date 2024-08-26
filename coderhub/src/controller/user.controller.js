const userService = require('../service/user.service')

class UserController {
    //  1创建用户
  async create(ctx, next){
    // 获取请求参数
    const user = ctx.request.body;
    // 查询数据 并返回数据
    return ctx.body = await userService.create(user);
  }

  async avatarInfo(){

  }
}

module.exports = new UserController();
