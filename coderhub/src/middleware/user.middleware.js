const userService = require('../service/user.service')
// const {NAME_OR_PASSWORD_IS_REQUIRED, NAME_IS_EXISTS} = require("../config/error");
const errorTypes = require("../config/error");
const md5Password = require("../utils/md5-password");

// user校验
const verifyUser = async (ctx, next) => {
  //  1.获取用户名和密码
  const {name, password} = ctx.request.body;
  // 2. 判断用户名或者密码不能空
  if ( !name || !password ) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, ctx);
  }
  //3.判断这次注册的用户名是没有被注册过
  let users = await userService.getUserByName(name);
  if ( users.length > 0 ) {
    const error = new Error(errorTypes.NAME_IS_EXISTS);
    return ctx.app.emit('error', error, ctx);
  }
  await next();
}
// 用户密码加密
const handlePassword = async (ctx, next) => {
  const {password} = ctx.request.body;
  // 加解密 算法
  ctx.request.body.password = md5Password(password);
  // 执行下一个中间件
  await next();
}
module.exports = {
  verifyUser,
  handlePassword
}
