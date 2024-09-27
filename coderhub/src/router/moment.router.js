const {verify} = require('jsonwebtoken');

const Router = require('@koa/router')

const momentRouter = new Router({prefix:'/moment'})

const {verifyAuth} = require('../middleware/auth.middleware')

const {create,list} = require('../middleware/moment.middleware')


// 新增
momentRouter.post('/',verifyAuth,create);
// 列表
momentRouter.get('/list', list);

module.exports = momentRouter;

