const express = require('express');
const port =3000
const app = express();
// 中间件注册方式
// app/router.use =>  app.use();
// app/router.methods  =>  app.get()  app.post()

// 中间件 给express    创建的app 传入一个回调函数

app.post('/login',(req, res,next) => {

    req.age=90
    // res.end("Welcome") // 结束响应
    res.json({code:200,message:'success'})
    // 当前中间件未结束 执行下一个中间件
    next()
})
// 使用use 注册中间件
app.use((req, res,next) => {
    console.log('next ')
    res.end('Welcome')
})
app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})