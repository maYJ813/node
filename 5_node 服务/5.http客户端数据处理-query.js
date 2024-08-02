
const http = require('http')
const url = require('url')
const qs = require('querystring')
const port = 3000

const server = http.createServer((req, res) => {


  // 1.1 解析url
  const urlString = req.url
  const urlInfo = url.parse(urlString,true)
  // 1.2 解析query
  const queryString = urlInfo.query
  console.log('queryString', queryString)
  // const queryInfo = qs.parse(queryString)
  // console.log('queryInfo', queryInfo)
  res.end('Hello World!\n')
})

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})




