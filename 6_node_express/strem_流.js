const express = require('express');
const cors = require('cors');
const port = 3000;

const app = express();
app.use(cors());
app.get('/list',(req,res)=>{
  res.set({
    'Content-Type': 'text/event-stream', //设置流方式
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.flushHeaders();
  setInterval(()=>{
    const data = {
      message: `Current time is ${ new Date().toLocaleTimeString() }`
    };
    res.write(`data: ${JSON.stringify(data)}\n\n`); // 注意 \n\n 两行是必需的
  },1000)


})

app.listen(port,()=>{
  console.log(`Server is running at http://localhost:${port}`);
})
