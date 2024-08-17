
const Koa = require('koa');
const port = 3000;
const app = new Koa();

// 注册中间件 ctx ,next 区分路径和方式
app.use((ctx, next) => {
  // 区分路径
  if (ctx.path === '/admin') { //http://localhost:3000/admin
    ctx.body = 'Welcome to admin'
  } else if (ctx.path === '/login') {
    if(ctx.method === 'POST') {
      ctx.body = 'Login success'
    }
  }
  next() // 本质是dispatch
})




app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
