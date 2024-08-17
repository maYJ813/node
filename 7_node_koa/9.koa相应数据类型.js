const Koa = require('koa')
const port = 3000
const app = new Koa()

const Router = require('@koa/router')
const fs = require('fs');

const router = new Router({prefix: '/users'})

router.get('/', (ctx, next) => {
  debugger;
  // 1.字符串类型
  // ctx.body='get user'
  // 2.buffer
  // ctx.body = Buffer.from('hello world')
//   3.流
//   const readStream = fs.createReadStream('./uploads/1.jpg')
//   ctx.type = 'image/jpeg' // 告诉客户端返回的数据类型
//   ctx.body = readStream
//   4.body arr\object
//   ctx.status =201
  ctx.body = JSON.stringify({code: 0, name: 'jack', age: 18})
//   5 null
//   ctx.body = null //不输出任何内容
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(port, () => {
  console.log(`Server running at http://localhost:${ port }`)
})
