const express = require('express')
const bodyParser = require('body-parser')
const port = 3000
// create application/json parser
let jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({extended: true});


const app = express()

app.get('/user:id', (req, res) => {
  console.log(req.params) //{ id: ':526' }
  res.send(`User ID: ${req.params.id}`)
})
app.get('/home/list', (req, res,next) => {
  // http://localhost:3000/home/list?page=1&pageSize=12
  console.log(req.query) //{ page: '1', pageSize: '12' }
  res.json(req.query)
})
// params
app.get('/home',(req,res,next) => {
  console.log(req.params) //{ user: 'sfsf', age: '12' }
  res.json(req.params)
})
// post JSON request
app.post('/page',jsonParser,(req,res,next) => {
  console.log(req.body) //{ user: 'jack', password: '12312' }
  res.json(req.body)
})
// x-www-form-urlencoded
app.post('/login',urlencodedParser,(req,res,next)=>{
  console.log(req.body) //{ name: 'jack' }
  res.json(req.body)
})

app.listen(port,() => {
  console.log(`Server is running at http://localhost:${port}`)
})


