const  Koa = require('koa');

const KoaRouter = require('@koa/router');

// session
const koaSession = require('koa-session');

const app = new Koa()

const userRouter = new KoaRouter({prefix:'/user'})

const session = koaSession({
    key: 'sessionId', // (string) cookie key (default is koa:sess)
    maxAge: 86400000, // (number) maxAge in ms (default is 1 days)
    overwrite: true, // (boolean) can overwrite or not (default true)
    // httpOnly: true, // (boolean) httpOnly or not (default true)
    signed: true, // (boolean) signed or not (default true) 加密

},app)
// 加盐操作
app.keys=['code','why']
// 使用session
app.use(session)
userRouter.get('/login', (ctx,next) => {
    console.log(ctx.session)
    ctx.session.slogan = 'leo'
    ctx.body = 'this is a user page'
})
userRouter.get('/list', (ctx,next) => {

    const value = ctx.session.slogan
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