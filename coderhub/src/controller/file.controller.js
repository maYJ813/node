const fileService = require('../service/file.service.js')
const userService = require('../service/user.service.js')

const {AVATAR_PATH} = require('../config/file-path')
const {APP_HOST, APP_PORT} = require('../app/config')

class FileController {

  async saveAvatarInfo(ctx, next){
    console.log('file', ctx.file);
    // 获取图像相关的信息
    const {filename, mimetype, size,originalname } = ctx.file
    const {id} = ctx.user
    // 2. 将图像信息数据保存到数据库中
    const result = await fileService.createAvatar(filename,originalname, mimetype, size, id,)
    // 3. 将图片地址保存到user表中
    const avatarUrl = `${ APP_HOST }:${ APP_PORT }/users/avatar/${ id }`
    await userService.updateAvatarUrlById(avatarUrl, id)
    // 4. 返回结果
    ctx.body = {
      code: 0,
      message: '上传头像成功~',
      data:{
        url: avatarUrl
      }
    }
  }

  async savePictureInfo(ctx, next){
    // 1. 获取图像信息
    const files = ctx.req.files;
    const {id} = ctx.user;
    const {momentId} = ctx.query;
    // 2.将所有的文件信息保存到数据库中
    for (let file of files) {
      const { filename, mimetype, size } = file;
      await fileService.createFile(filename, mimetype, size, id, momentId);
    }

    ctx.body = '动态配图上传完成~'
  }
}

module.exports = new FileController();
