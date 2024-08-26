const Router = require('@koa/router')
// const UserController = require('../controller/user.controller')
const {create, avatarInfo} = require('../controller/user.controller')
const {verifyUser, handlePassword} = require("../middleware/user.middleware");

const userRouter = new Router({prefix: '/users'})

// 1. http://localhost:3000/users
userRouter.post('/', verifyUser, handlePassword, create)
//用户信息
userRouter.get('/:userId/avatar', avatarInfo)
module.exports = userRouter
