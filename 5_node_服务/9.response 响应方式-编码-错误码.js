
const http = require('http')
const port = 3000

const server = http.createServer((req, res) => {

  // res.setHeader('Content-Type', 'text/plain; charset=utf-8') // 设置编码格式
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
  let list =[
    { id: 1, name: 'Tom', age: 18 },
    { id: 2, name: 'Jerry', age: 20 },
    { id: 3, name: 'Lucy', age: 17 },
    { id: 4, name: 'Lily', age: 19 },
  ]
  res.end(JSON.stringify(list)) // 结束流写入
})

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})




