const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const useRoutes = require('../router')
const errorHandle = require('../utils/error-handle')


const app = new Koa()

app.useRoutes = useRoutes;
// 中间件注册
app.use(bodyParser())
app.useRoutes();

app.on('error', errorHandle)

module.exports = app
