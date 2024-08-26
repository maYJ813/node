

const app = require('./app')
const {SERVER_PORT} = require('./config/server')
require('./app/database');
// // 封装错误处理
// require('./utils/handle.error')

app.listen(SERVER_PORT,()=>{
  console.log(`Server running at http://localhost:${SERVER_PORT}`)
})
