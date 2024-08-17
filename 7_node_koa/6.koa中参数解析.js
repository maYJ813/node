
const Koa = require('koa');
const Router = require('@koa/router')
const multer = require('@koa/multer')
const bodyParser = require('koa-bodyparser')
const port =3000;
const app = new Koa();

// 注册 bodyParser
app.use(bodyParser());
// 注册解析form data parser
const formParser = multer();

const  router = new Router({prefix:'/users'})

/**
 * 1.get params -> /:id
 * 2.get query -> ?name=jack&age=18
 * 3.post json -> {"name":"jack","age":"18"}
 * 4.post x-www-form-urlencoded
 * 5.form-data 表单
 */

// 1.params http://localhost:3000/users/wewe
router.get('/:id',(ctx,next) => {
  console.log(ctx.params) //{ id: '526' }
  ctx.body = `User ID: ${ctx.params.id}` //User ID: wewe
})
// 2.query http://localhost:3000/users?name=jack&age=18
router.get('/',(ctx,next) => {
  console.log(ctx.query) //{ name: 'jack', id: '18' }
  ctx.body=`User:${ctx.query.name},Id:${ctx.query.id}` //User:jack,Id:18
})
// 3.post /json 使用第三方库  koa-bodyparser
router.post('/',(ctx,next) => {
  // console.log(ctx.request.body) // undefined;
  // ctx.body = `User:${ctx.request.body.name},Id:${ctx.request.body.age}` //User:jack,Id:18
  // ctx.body = 'json'
//   使用body-parser 之后
  console.log(ctx.request.body) //{ name: 'jack', age: '18' }
  ctx.body = `User:${ctx.request.body.name},Id:${ctx.request.body.age}` //User:jack,Id:18
})

// 4.post x-www-form-urlencoded
router.post('/urlencoded',(ctx,next) => {
  console.log(ctx.request.body) //{ name: 'jack', age: '20' }
  ctx.body = `User:${ctx.request.body.name},Id:${ctx.request.body.age}` //User:jack,Id:18
})
// form data 使用multer 库解析
router.post('/form',formParser.any(),(ctx,next) => {
  // console.log(ctx.request.body) // {}
  // 使用multer
  console.log(ctx.request.body) // { name: 'jack', age: '20' }
  ctx.body = `User:${ctx.request.body.name},Id:${ctx.request.body.age}`
})

// 5. 404

app.use(router.routes());
app.use(router.allowedMethods());


app.listen(port, ()=>{
  console.log(`Server running at http://localhost:${port}`)
})

