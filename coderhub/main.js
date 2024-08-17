

const Koa = require('koa')
const {SERVER_PORT} = require('./config/server')
const bodyParser = require('koa-bodyparser')
const Router = require('@koa/router')

const app = new Koa()
app.use(bodyParser())
const userRouter = new Router({prefix:'/users'})

userRouter.get('/list',(ctx,next) => {
  ctx.body ='user list'
})

app.use(userRouter.routes())
app.use(userRouter.allowedMethods())



app.listen(SERVER_PORT,()=>{
  console.log(`Server running at http://localhost:${SERVER_PORT}`)
})
