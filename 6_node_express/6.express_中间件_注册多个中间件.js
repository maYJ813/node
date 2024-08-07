const express = require('express');
const port =3000
const app = express();



app.get('/home', (req,res,next) => {
    console.log('match home  get request')
    res.end('Welcome to home')
    next();// next 执行之后 后面中间件 才会执行
},(req, res, next) => {
    console.log('middleware 1')
    next()
},(req, res, next) => {
    console.log('middleware 2')
    next()
})
app.post('/list', (req,res,next) => {
    console.log('match list  get request')
    res.end('Welcome to list')
})




app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})