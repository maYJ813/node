const connection = require('../app/database.js')

class MomentService {
  async create(userId, content){
    const statement = `INSERT INTO moment (content, user_id) VALUES (?, ?);`;
    const [result] = await connection.execute(statement, [content, userId]);
    return result;
  }

  async getMomentList(offset, limit){
    // const statement = `
    //   SELECT
    //     m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
    //     JSON_OBJECT('id', u.id, 'name', u.name) author,
    //     (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount,
    //     (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount,
    //     (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/', file.filename))
    //     FROM file WHERE m.id = file.moment_id) images
    //   FROM moment m
    //   LEFT JOIN user u ON m.user_id = u.id
    //   LIMIT ?, ?;
    // `;
    const statement =  `
      SELECT 
        m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
        JSON_OBJECT('id', u.id, 'name', u.name) author,
        (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount,
        (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount,
      FROM moment m
      LEFT JOIN user u ON m.user_id = u.id
      LIMIT ?, ?;
    `;
    const [results] = await connection.execute(statement, [offset, limit]);
    return results;
  }
}

module.exports = new MomentService();
