const connection = require('../app/database.js');

class FileService {
  // 新增头像
  async createAvatar(filename,originalname, mimeType, size, userId){
    const statement = `INSERT INTO avatar (filename,original_name,mimeType,size,user_id) VALUES (?,?,?,?,?)`;
    const [result] = await connection.execute(statement, [filename,originalname, mimeType, size, userId]);
    return result;
  }

  // 根据userId 获取头像
  async getAvatarByUserId(userId){
    const statement = `SELECT * FROM avatar WHERE user_id =?`;
    const [result] = await connection.execute(statement, [userId]);
    return result[0];
  }

  async createFile(filename, mimeType, size, userId, momentId){
    const statement = `INSERT INTO file (filename,mimeType,size,userId,momentId) VALUES (?,?,?,?,?)`;
    const [result] = await connection.execute(statement, [filename, mimeType, size, userId, momentId]);
    return result;
  }

  async getFileById(filename){
    const statement = `SELECT * FROM file WHERE filename =?`;
    const [result] = await connection.execute(statement, [filename]);
    return result[0];
  }
}

module.exports = new FileService();
