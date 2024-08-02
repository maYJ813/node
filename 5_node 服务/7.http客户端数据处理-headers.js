
const http = require('http')
const url = require('url')
const qs = require('querystring')
const port = 3000

const server = http.createServer((req, res) => {

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end('headers 内容',)
})

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})




