

const app = require('./app/index.js')
const {SERVER_PORT} = require('./config/server')

app.listen(SERVER_PORT,()=>{
  console.log(`Server running at http://localhost:${SERVER_PORT}`)
})
