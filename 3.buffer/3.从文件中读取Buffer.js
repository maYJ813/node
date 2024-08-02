
const fs = require('fs');

// 指定编码
fs.readFile('./aa.txt',{encoding:'utf-8'},(err,data)=>{
  console.log('data',data)
})

fs.readFile('./aa.txt',(err,data)=>{
  // 返回 buffer数据
  console.log('data',data)
})

fs.readFile('./aa.txt',(err,data)=>{
  console.log('data',data.toString())
})

// 读取图片
fs.readFile('./11.jpg',(err,data)=>{
  console.log('pic',data);
})
