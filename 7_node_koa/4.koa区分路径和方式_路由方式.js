
const Koa = require('koa');
const port = 3000;
const app = new Koa();
/**
 * 使用路由匹配 路径和方式
 * 常用路由
 * koa-router
 * @koa/router
 */
const Router = require('@koa/router');
// 创建router 对象
const router = new Router({prefix:'/users'}); // prefix 路由前缀，指定某一块 ，可以不使用

// 路由中注册中间件
router.get('/',(ctx,next) => {
  ctx.body = 'Hello World user'
})
// http://localhost:3000/users/2323
router.get('/:id',(ctx,next) => {
  ctx.body = `Hello World user id:${ctx.params.id}`
})
// http://localhost:3000/users
router.post('/',(ctx,next) => {
  ctx.body = 'post user'
})
router.delete('/:id',(ctx,next) => {
  ctx.body = `delete user id:${ctx.params.id}`
})
router.patch('/:id',(ctx,next) => {
  ctx.body = `patch user id:${ctx.params.id}`
})


// 路由中间件 生效
app.use(router.routes())
app.use(router.allowedMethods())


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
