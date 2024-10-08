const mysql = require('mysql2')
const config = require('./config')

// 1创建连接池
const connectPool = mysql.createPool({
  host: config.MYSQL_HOST,
  port: config.MYSQL_PORT,
  database: config.MYSQL_DATABASE,
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  connectionLimit: config.MYSQL_CONNECTIONLIMIT,
})
// 2.  从连接池中获取连接
connectPool.getConnection((err, connection) => {
  // 连接失败
  if ( err ) {
    console.log('[CONNECTION ERROR] - ', err.message);
    return;
  }
  //数据库连接测试
  connection.connect(err => {
    if ( err ) {
      console.log('数据库交互失败', err)
    } else {
      console.log('数据库连接成功')
    }

  })

  // 使用query 查询
  /*connection.query('SELECT * FROM `user`', function (err, results, fields){
   connection.release();
   if ( err ) {
   console.log('[QUERY ERROR] - ', err.message);
   return
   }
   console.log('result', results);
   })*/
  // 使用execute 查询
  /*  connection.execute('SELECT * FROM `user`', function (err, result){
   connection.release();
   if ( err ) {
   console.log('[QUERY ERROR] - ', err.message);
   return
   }
   console.log('result', result);
   })*/

  // 执行sql 插入
  /* connection.query('INSERT INTO `user` ( name, password ) VALUES (?,?)', ['admin', '123456'], function (err, result){
   connection.release();
   if ( err ) {
   console.log('[QUERY ERROR] - ', err.message);
   return
   }
   console.log('result', result);
   })*/

})
// 3获取连接池对象
const connection = connectPool.promise()
module.exports = connection;



