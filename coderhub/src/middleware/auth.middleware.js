
const jwt = require('jsonwebtoken');
const errorTypes = require('../config/error')
const userService = require('../service/user.service')
const md5Password = require('../utils/md5-password')
const {PUBLIC_KEY}= require('../app/config')

const verifyLogin = async (ctx, next) => {

  const {name, password} = ctx.request.body;

  // 用户名、密码不能为空
  if ( !name || !password ) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error,ctx)
  }
  // 判断是否存在用户
  const result = await userService.getUserByName(name)
  if ( !result.length ) {
    const error = new Error(errorTypes.USER_DOES_NOT_EXISTS)
    return ctx.app.emit('error', error,ctx)
  }
  const user = result[0];
  // 验证 用户 密码是否一致
  if ( md5Password(password) !== user.password ) {
    const error = new Error(errorTypes.PASSWORD_IS_INCORRENT)
    return ctx.app.emit('error', error,ctx)
  }
  ctx.user = user;
  await next()
}

const verifyAuth = async(ctx,next)=>{

  const authorization = ctx.headers.authorization;
  if(!authorization){
   const error = new Error(errorTypes.UNAUTHORIZATION);
   return ctx.app.emit('error', error,ctx)
  }
  const token = authorization.replace('Bearer', '');

  try{
    ctx.user = jwt.verify(token, PUBLIC_KEY, {algorithms: ['RS256']});
    await next();  // 验证通过，继续下一个 middleware
  }catch(err){
    const error = new Error(errorTypes.UNAUTHORIZATION)
    return ctx.app.emit('error', error,ctx)
  }
}

module.exports = {
  verifyLogin,
  verifyAuth,
}
