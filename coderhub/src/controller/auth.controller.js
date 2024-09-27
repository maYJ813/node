const jwt = require('jsonwebtoken');

const {PRIVATE_KEY} = require('../app/config');

class AuthController {
/*
*用户登录
*/
  async login(ctx, next){

    const {id, name} = ctx.user;
    try{
      const token = jwt.sign({id, name}, PRIVATE_KEY, {expiresIn: '12h', algorithm: 'RS256'});
      ctx.body = {id, name, token};
    }catch(e){
      console.log('e',e)
    }

  }
  async success(ctx, next) {
    ctx.body = "授权成功~";
  }
}

module.exports = new AuthController();
