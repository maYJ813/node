const Koa = require('koa');
const port = 3000;
const Router = require('@koa/router');
const multer = require('@koa/multer');

const app = new Koa();

// const upload = multer({dest: 'uploads/'}); // 默认路径
// 自定义文件路径
const upload =multer({
  storage:multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '_' + file.originalname)
    }
  })
})
const router = new Router({prefix: '/upload'});

// 单文件上传 参数 avatar
router.post('/avatar', upload.single('avatar'), async (ctx, next) => {
  console.log('avatar',ctx);
  console.log('avatar1',ctx.request.file);
  console.log('avatar2',ctx.req.file);
  console.log('avatar3',ctx.file);
  // console.log(ctx.request.file);
  ctx.body = 'File uploaded successfully!';
})
// 多文件上传
router.post('/photos', upload.array('photos', 12), async (ctx, next) => {
  console.log(ctx.request.files);
  ctx.body = 'Files uploaded successfully!';
})

// 错误处理

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(port, () => {
  console.log(`Server running at http://localhost:${ port }`)
})

