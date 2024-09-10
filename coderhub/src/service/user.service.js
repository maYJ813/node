const mysql = require('mysql2');
const connection = require('../app/database');

class UserService {

  // 创建用户
  async create(user){
    //   1.获取用户
    const {name, password} = user
    //   2.拼接
    const statement = 'INSERT INTO `user` ( name, password ) VALUES ( ?,?);'
    // 3.执行sql语句  ? 将被name password 替换
    let result = await connection.execute(statement, [name, password])
    return result[0];
  }

//   查询用户
  async getUserByName(name){
    const statement = 'SELECT * FROM `user` WHERE name = ?;'
    let result = await connection.execute(statement, [name])
    return result[0];
  }

//更新用户头像
  async updateAvatarUrlById(avatarUrl, userId){
    const statement = 'UPDATE `user` SET avatar_url =? WHERE id =?;'
    let [result] = await connection.execute(statement, [avatarUrl, userId])
    return result;
  }
}

module.exports = new UserService();
