const http = require('http');
const server = http.createServer((req, res) => {
  console.log('req',req.url)
  let fileName = '.' +req.url
  if(fileName === './sse') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    })
    let interval = setInterval(() => {
      res.write(`data: ${new Date().toLocaleTimeString()}\n\n`);
    },1000)

    req.connection.addListener(
      'close',
      () => {
        clearInterval(interval);
      },
      false
    )
  }

})
server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
