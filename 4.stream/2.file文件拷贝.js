
const fs = require('fs');

// 1一次性读取文件并写入
fs.readFile('./aa.txt', { encoding: 'utf-8' }, (err, data)=>{
  fs.writeFile('./bb.txt', data, { encoding: 'utf-8' }, (err)=>{
    console.log(33)
  })
})
// 2以流的方式读写
const rs = fs.createReadStream('./aa.txt', );
const ws = fs.createWriteStream('./cc.txt', { encoding: 'utf-8' });

// rs.on('data', (chunk) => {
//   console.log('chunk', chunk.toString());
//   ws.write(chunk, 'utf-8', (err) => {})
// })
// rs.on('end', () => {
//   console.log('end');
//   ws.close()
// })

//3.使用pip 管道 可读流直接输入到可写流
rs.pipe(ws);
