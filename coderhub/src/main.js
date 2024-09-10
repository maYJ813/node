

const app = require('./app')
const config = require('./app/config');
require('./app/database');
// // 封装错误处理
// require('./utils/handle.error')

app.listen(`${config.APP_PORT}`,()=>{
  console.log(`Server running at http://localhost:${config.APP_PORT}`)
})
