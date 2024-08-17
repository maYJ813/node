
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

module.exports = router;
