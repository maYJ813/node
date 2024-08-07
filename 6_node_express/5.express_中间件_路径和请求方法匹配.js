const express = require('express');
const port =3000
const app = express();


// 注册路径匹配、请求方法限制 app.method(path,middleware)
app.get('/home', (req,res,next) => {
    console.log('match home  get request')
    res.end('Welcome to home')
})


app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})