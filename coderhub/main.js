

const Koa = require('koa')
const port = 3000
const app = new Koa()
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())
const Router = require('@koa/router')
const userRouter = new Router({prefix:'/users'})


userRouter.get('/list',(ctx,next) => {
  ctx.body ='user list'
})

app.use(userRouter.routes())
app.use(userRouter.allowedMethods())



app.listen(port,()=>{
  console.log(`Server running at http://localhost:${port}`)
})
