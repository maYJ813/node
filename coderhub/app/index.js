const Koa = require('koa')
const app = new Koa()

const bodyParser = require('koa-bodyparser')
// user路由
const userRouter = require('../router/userRouter.js')

// 中间件注册
app.use(bodyParser())
// user 路由
app.use(userRouter.routes())
app.use(userRouter.allowedMethods())


module.exports = app
