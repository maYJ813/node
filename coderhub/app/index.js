const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
// user路由
const userRouter = require('../router/user.router.js')
// const registerRoutes = require('../router')
const app = new Koa()
// 中间件注册
app.use(bodyParser())
// // user 路由
app.use(userRouter.routes())
app.use(userRouter.allowedMethods())
// registerRoutes(app)



module.exports = app
