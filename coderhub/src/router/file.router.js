
const Router = require('@koa/router');

const {verifyAuth} = require('../middleware/auth.middleware.js')

const fileRouter = new Router();

fileRouter.post('/avatar',verifyAuth,)

module.exports = fileRouter;
