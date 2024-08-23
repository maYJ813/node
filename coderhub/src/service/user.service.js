const mysql = require('mysql2');
const connection = require('../app/database');

class UserService {

  async create(user){
    //   1.获取用户
    const { name,password} = user
    //   2.拼接
    const statement = 'INSERT INTO `user` ( name, password ) VALUES ( ?,?);'
    // 3.执行sql语句  ? 将被name password 替换
    return await connection.execute(statement, [name, password])

  }
}

module.exports = new UserService();
