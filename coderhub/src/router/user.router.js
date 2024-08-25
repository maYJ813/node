const Router = require('@koa/router')
const UserController = require('../controller/user.controller')
const {verifyUser} = require("../middleware/user.middleware");


const userRouter = new Router({prefix:'/users'})

// 对业务进行抽取封装
// userRouter.post('/',UserController.createUser)
// 抽取 校验 执行 createUser 前通过中间件 校验
userRouter.post('/', verifyUser ,UserController.createUser)
module.exports =userRouter
