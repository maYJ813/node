
const express = require('express')

const port =3000;

const app = express()

// 自定义解析， 可使用express现有中间件 app.json()  app.urlencoded() 等
// app.use((req,res,next)=>{
//   if(req.headers['content-type'] === 'application/json'){
//     req.on('data',(data)=>{
//       req.body = JSON.parse(data.toString())
//       console.log(req.body) //{ user: 'jack', password: '123' }
//       next()
//     })
//     req.on('end',()=>{
//       next()
//     })
//   }else{
//     next();
//   }
// })
app.use(express.json()); // json request
app.use(express.urlencoded({ extended: true })); // urlencoded request
app.post('/login', (req, res) => {
  // console.log(req)
  // console.log(req.body) //{ user: 'jack', password: '12312' }
  console.log(req.body) //{ user: 'leo', age: '18' }
  res.json(req.body)
})

app.listen(port, ()=>{
  console.log(`Server is running at http://localhost:${port}`)
})
