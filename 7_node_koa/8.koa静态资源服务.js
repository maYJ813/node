const Koa = require('koa')
const port = 3000
const static = require('koa-static')


const app = new Koa()

// app.use(static('./uploads'))
app.use(static('./build')) //静态资源地址


app.listen(port,()=>{
  console.log(`Server running at http://localhost:${port}`)
})
