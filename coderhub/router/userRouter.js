const Router = require('@koa/router')
const UserController = require('../controller/user.controller')

const userRouter = new Router({prefix:'/users'})


// 用户注册
/*userRouter.post('/',(ctx,next)=>{

  // 1.获取参数
  const user = ctx.request.body;
  // 2.逻辑判断
  // 3.存入数据库
  // 4.查看结果，返回内容
  console.log('user', user)
  ctx.body='用户注册'
})*/
// 对回调 业务进行抽取封装
userRouter.post('/',UserController.createUser)

module.exports =userRouter
