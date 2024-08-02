
const http = require('http')
const url = require('url')
const qs = require('querystring')
const port = 3000

const server = http.createServer((req, res) => {
// 执行body参数
//   request 本质是一个可读流
  req.setEncoding('utf8')
  let isLogin =false;
  req.on('data', (chunk) => {
    console.log('chunk', chunk)
    // 转为对象
    let data = JSON.parse(chunk)
    if(data.name=='admin' &&data.password=='123'){
      isLogin = true
    }else{
      isLogin = false
    }
  })
  req.on('end', () => {
    console.log('end request')
    // res.end('Hello World!\n')
    if(isLogin){
      res.end('登录成功')
    }else{
      res.end('登录失败')
    }
  })
})

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})




