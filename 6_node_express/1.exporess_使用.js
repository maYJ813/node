
const express = require('express');

const port =3000;
// 1.创建
const app = express();

// 客户端访问 url /login  、 /home
app.post('login',(req,res)=>{
    console.log("login")
    res.end('login success')
})
app.get('/home',(req,res)=>{
    console.log('home')
    res.end('login success')

})
// 启动 服务
app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
});
