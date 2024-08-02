
const http = require('http');

const port = 3000;

const server = http.createServer((req, res) => {
  console.log(req)
  // 向客户端返回结果
  res.end('Hello, World!')
})

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
