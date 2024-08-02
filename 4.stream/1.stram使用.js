
const fs = require('fs');
// 一次性读取
// fs.readFile('./aa.txt',{encoding:'utf-8'},(err,data)=>{
//   console.log('data',data)
// })
// stream 流方式读取
const readStream = fs.createReadStream('./aa.txt',{encoding:'utf-8',});
// 监听数据读取
readStream.on('data',(chunk)=>{
  console.log('chunk',chunk);
})
readStream.on('end',()=>{
  console.log('end');
})
