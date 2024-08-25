const Router = require('@koa/router')
const UserController = require('../controller/user.controller')
const {verifyUser, handlePassword} = require("../middleware/user.middleware");


const userRouter = new Router({prefix:'/users'})

//  对业务进行抽取封装
// userRouter.post('/',UserController.createUser)
//1. 用户注册 抽取 校验 执行 createUser 前通过中间件 校验; 加密用户密码
userRouter.post('/', verifyUser ,handlePassword,UserController.createUser)
// 2.用户登录  用户凭证 token
// userRouter.post('/login', UserController.login)
module.exports =userRouter
