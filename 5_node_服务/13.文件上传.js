
const fs = require('fs');
const path = require('path');
const http = require('http')
const port = 3000

const server = http.createServer((req, res) => {
  // 设置编码 二进制数据
  req.setEncoding('binary')
  // 'multipart/form-data; boundary=----WebKitFormBoundary0MjF8UwfnWyXMsba'
  const boundary = req.headers['content-type'].split('; ')[1].trim().replace('boundary=', '')
  let formData =''
  req.on('data', (chunk) => {
    console.log(3333,chunk)
    formData += chunk
  })
  req.on('end', () => {
    const imageType = 'image/jpeg'
    const imageTypePosition = formData.indexOf(imageType) + imageType.length
    let imageData = formData.substring(imageTypePosition)
    // 替换空格
    imageData = imageData.replace('/^\s\s*/','')
    // 替换boundary
    imageData = imageData.substring(0, imageData.indexOf(`--${boundary}--`)).trim();
    // 存储
    fs.writeFile('./image.jpg', imageData,'binary', (err) => {
      if (err) throw err
      console.log('Image saved!')
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('Image uploaded successfully!')
    })
    console.log('done')
  })
})

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})


