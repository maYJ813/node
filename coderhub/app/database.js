const mysql = require('mysql2')

try {
// 1创建连接池
  const connectPool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    database: 'codehub',
    user: 'root',
    password: '123456',
    connectionLimit: 10, // 连接池最大连接数
  })
  // 2. 获取连接，是否连接成功
  connectPool.getConnection((err, connection) => {
    if ( err ) {
      console.log('连接失败', err)
      return;
    }
    //数据库连接测试
    connection.connect(err => {
      if ( err ) {
        console.log('数据库交互失败', err)
      } else {
        console.log('数据库连接车成功')
      }

    })

  })
  // 3获取连接池对象
  const connection = connectPool.promise()
  module.exports = connection;
} catch(e){
  console.log('e', e)
}




