
const userService =require('../service/user.service')
class UserController {

    //   1创建用户
  createUser(ctx, next) {
    // 获取请求参数
    const {username,password} = ctx.request.body;
    // 2 验证参数
    // if (!username ||!password) {
    //   return ctx.status(400).json({
    //     message: 'Username and password are required',
    //   });
    // }
    // 3创建并保存用户
    userService.create({username,password})
  }
}

module.exports = new UserController();
