const Router = require('@koa/router')
const UserController = require('../controller/user.controller')

const userRouter = new Router({prefix:'/users'})

// 对业务进行抽取封装
userRouter.post('/',UserController.createUser)
module.exports =userRouter
