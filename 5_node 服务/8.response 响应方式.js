
const http = require('http')
const port = 3000

const server = http.createServer((req, res) => {

  // res.setHeader('Content-Type', 'text/plain; charset=utf-8') // 设置编码格式
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
  res.write('hello world')
  res.write('哈啊哈')
  res.end() // 结束流写入
})

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})




