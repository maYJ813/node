const http = require('http')
const url = require('url')  // 解析url
const port =3000;

const server = http.createServer((req, res) => {
  // /login?limit=12&name=jack
  // 1.query 传参
  const urlString = req.url;
  const userInfo= url.parse(urlString, true).query;
  console.log('userInfo', userInfo)
  res.end("Hello World!\n")
})

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
