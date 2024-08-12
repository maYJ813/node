
const express = require('express');
const path = require('path');
const multer = require('multer');
const port = 3000;
const app = express();

const storage =multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + `_${file.originalname}`)
  }
})

const upload = multer({
  // dest: path.resolve(__dirname, 'uploads/') //直接存储
  storage: storage, //磁盘存储
})
// 单个文件
app.post('/profile', upload.single('avatar'), (req, res, next) => {
  console.log(req.file)
  res.end('头像上传成功~')
})
// 多个文件
app.post('/photos/upload', upload.array('files', 12), function (req, res, next) {
  //multer实例.array(fielname[,maxCount])——接收一个以fielname命名的文件数组;maxCount——限制上传的最大数量，这些文件的信息保存在req.files里面
  res.send('ok')
})


// 多个文件
app.post('/uploads', upload.array('uploads', 12), function (req, res, next) {
  //multer实例.array(fielname[,maxCount])——接收一个以fielname命名的文件数组;maxCount——限制上传的最大数量，这些文件的信息保存在req.files里面
  res.send('ok')
})



app.listen(port,()=>{
  console.log(`Server running at http://localhost:${port}`)
})
