

const SERVER_PORT =3000

// 使用dotenv 加载 .env 配置文件
const dotenv = require('dotenv');
dotenv.config();
console.log(process.env.SERVER_PORT)

module.exports={
  SERVER_PORT,
}
