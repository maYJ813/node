const express = require('express');
const port =3000
const app = express();


// 注册路径匹配中间件
app.use('/home',(req, res, next) => {
    console.log('admin middleware')
    res.end('Welcome to admin')
    // next()
})

// 注册路径匹配中间件

app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})