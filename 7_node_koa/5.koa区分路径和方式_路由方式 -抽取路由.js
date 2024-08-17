
const Koa = require('koa');
const port = 3000;
const app = new Koa();

const userRouter = require('./router/userRouter')

// 路由中间件 生效
app.use(userRouter.routes())
app.use(userRouter.allowedMethods())


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
