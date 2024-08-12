
const express = require('express')
const port = 3000;

const app = express()

// params http://localhost:3000/login/abc/why
app.use('/login/:id/:name',(req, res, next) => {
  console.log(req.params) //{ id: 'abc', name: 'why' }
  res.json(req.params)
})
// query http://localhost:3000/login?username=why&password=123
app.use('/login',(req, res, next) => {
  console.log(req.query) //{ id: '123', name: 'code' }

  res.json(req.query)
})


app.listen(port,()=>{
  console.log(`Server running at http://localhost:${port}`)
})



