const Router = require('@koa/router')

const userRouter = new Router({prefix:'/users'})


userRouter.get('/list',(ctx,next) => {
  ctx.body ='user list'
})

module.exports =userRouter
