const userService = require('../service/user.service')

class UserController {
    //  1创建用户
  async create(ctx, next){
    // 获取请求参数
    const user = ctx.request.body;
    // 查询数据 并返回数据
    const result = await userService.create(user);
    ctx.body = {
      code: 0,
      message: '创建成功',
      data: result
    };
  }

  async avatarInfo(){

  }
}

module.exports = new UserController();
