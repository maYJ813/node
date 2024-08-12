
const express = require('express')
const morgan = require('morgan');
const fs = require('fs')
// const path = require('path')
const port =3000;
const app = express()

const accessStream = fs.createWriteStream('./access.log',{
  encoding:'utf8',
  flags:'a+'
})

app.use(morgan('combined',{stream:accessStream}))

app.get('/log',(req,res,next) => {
  res.json({success:200,message:'log'})
})
app.post('/home',(req,res,next)=>{
res.json({success:200,message:'home'})
})

app.listen(port, ()=>{
  console.log(`Server is running at http://localhost:${port}`)
})
