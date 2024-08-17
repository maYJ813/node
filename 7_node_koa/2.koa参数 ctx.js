
const Koa = require('koa');
const port = 3000;
const app = new Koa();

// 注册中间件 ctx ,next
// ctx 上下文对象  ctx.request 获取请求  ctx.response 获取相应
app.use((ctx, next) => {
  console.log(`middleware 1 ${ctx.request.path}`)
  // 1请求对象
  console.log(ctx.request) // request 是koa 封装的对象
  console.log(ctx.req)  // req  s是node 封装的对象

  // 2相应对象
  console.log(ctx.response) // response koa 封装的对象
  console.log(ctx.res) // res node 封装相应对象
  // 其它属性 ctx.query  ctx.params ctx.body ctx.path
  console.log(ctx.query)
  console.log(ctx.params)

  next() // 本质是dispatch
})

app.use((ctx, next) => {
  console.log(`middleware 2 ${ctx.request.path}`)
  ctx.body = 'Hello Koa'
})



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
