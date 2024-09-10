const Router = require('@koa/router');

const {avatarHandler}  = require('../middleware/file.middleware')
const {verifyAuth} = require('../middleware/auth.middleware')
const {saveAvatarInfo} = require('../controller/file.controller')

// const multer = require('@koa/multer');

const fileRouter = new Router({prefix: '/upload'});

fileRouter.post('/avatar',  avatarHandler,verifyAuth,saveAvatarInfo)


module.exports = fileRouter;




