const express = require('express');
const port =3000
const app = express();

// 中间件注册 use
/*
use 普通中间件， 无论什么的请求方式都可以匹配
* */
app.use((req, res, next) => {
    console.log('middleware 1',req.url)
    console.log('next ')
})

app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})