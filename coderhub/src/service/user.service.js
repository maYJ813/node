const mysql = require('mysql2');
const connection = require('../app/database');

class UserService {

  // 创建用户
  async create(user){
    //   1.获取用户
    const { name,password} = user
    //   2.拼接
    const statement = 'INSERT INTO `user` ( name, password ) VALUES ( ?,?);'
    // 3.执行sql语句  ? 将被name password 替换
    let [result] = await connection.execute(statement, [name, password])
    return result;

  }
//   查询用户
  async findUserByName(name){
    const statement = 'SELECT * FROM `user` WHERE name = ?;'
    let [values,fields] = await connection.execute(statement, [name])
    return values;
  }
}

module.exports = new UserService();
