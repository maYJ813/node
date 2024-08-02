
const http = require('http');
const port1 = 2000;
const port2 = 3000;
const server1 = http.createServer((req, res) => {
  console.log('req1')
  res.end('Hello World! server1');
})
server1.listen(port1, () => {
  console.log(`Server running at http://localhost:${port1}/`);
})


const server2 = http.createServer((req, res) => {
  console.log('req2')
  res.end('Hello World! server2');
})
server2.listen(port2, () => {
  console.log(`Server running at http://localhost:${port2}/`);
})
