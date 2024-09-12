const fs = require('fs')
const userService = require('../service/user.service')
const fileService = require('../service/file.service')
const {AVATAR_PATH} = require('../config/file-path')

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

  // 用户信息
  async avatarInfo(ctx,next){
    // debugger
    // 获取用户id
    const { userId } = ctx.params;
    // 查询头像数据
    const avatarInfo = await fileService.getAvatarByUserId(userId);
    // // 响应头像数据
    // ctx.body = avatarInfo;
    const {filename,mimetype} = avatarInfo
    console.log('avatarInfo',avatarInfo)
    ctx.type  = mimetype;
    let result = fs.createReadStream(`${AVATAR_PATH}/${filename}`)
    console.log('result',result)
    ctx.body = result
  }
}

module.exports = new UserController();
