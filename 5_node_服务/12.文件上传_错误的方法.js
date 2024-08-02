
const fs = require('fs');
const path = require('path');
const http = require('http')
const port = 3000


const server = http.createServer((req, res) => {
  //   写入流
  // 问题； 图片不可查看 ； 原因是 图片数据流直接写入到硬盘，但是此时无法通过 http 协议来查看图片
  const ws = fs.createWriteStream(path.join(__dirname, './upload.png'), {
    flags: 'a+'
  })
  // req.pipe(ws)
  req.on('data', (chunk) => {
    req.on('data', (chunk) => {
      ws.write(chunk)
    })
  })
  req.on('end', () => {
    ws.close()
    res.end('upload success')
  })
})

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})


