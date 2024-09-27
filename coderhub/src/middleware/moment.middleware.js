
const momentService = require('../service/moment.service')

class MomentMiddleware {

  // 新增
  async create(ctx,next){
    debugger;
    const userId = ctx.user.id;
    const content = ctx.request.body.content;

    const result = await  momentService.create(userId,content);
    console.log('result',result);
    ctx.body = result;
  };
//   列表
  async list(ctx,next){
    const {offset,size} = ctx.query;

    const result = await momentService.getMomentList(offset,size);
    ctx.body = result;
  }

}

module.exports = new MomentMiddleware();
