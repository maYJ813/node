

const Koa = require('koa');
const port = 3000;
const app = new Koa();

// 注册中间件  只能通过 use注册中间件
app.use((ctx, next) => {
    console.log(`middleware 1 ${ctx.request.path}`)
    next()
  console.log(ctx.msg) // 执行完middleware 1 middleware 2 之后 输出Hello, Koa111!
})

app.use((ctx, next) => {
    console.log(`middleware 2 ${ctx.request.path}`)
    ctx.body = 'Hello, Koa!'
    ctx.msg = 'Hello, Koa111!'
})




app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
