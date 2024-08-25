const  Koa = require('koa');

const KoaRouter = require('@koa/router');

const app = new Koa()

const userRouter = new KoaRouter({prefix:'/user'})

userRouter.get('/login', (ctx,next) => {
    // 设置cookie 服务端设置cookie, 浏览器 ，客户端显示设置的cookie
    ctx.cookies.set('slogan','leo',{
        maxAge:60*1000, //max-age  毫秒 过期时间
    })
    ctx.body = 'this is a user page'

})
userRouter.get('/list', (ctx,next) => {
    // 获取cookie
    const  value= ctx.cookies.get('slogan')
    if(value && value ==='leo'){
        ctx.body='this is a user list'
    }else{
        ctx.body='用户没有权限，请先登录！'
    }
})

app.use(userRouter.routes())
app.use(userRouter.allowedMethods())


app.listen(3000,()=>{
    console.log('listening on http://localhost:3000')
})