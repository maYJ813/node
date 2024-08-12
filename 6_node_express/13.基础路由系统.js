
const express = require('express')
const port = 3000;

const app = express()
app.use(express.json())

const userRouter = express.Router()
// 获取id
userRouter.get('/:id',(req,res,next)=>{
  const id = req.params.id
  res.json({
    id,
    msg:`请求用户id:${id}`,
    status: 200
  })
})
// 删除id
userRouter.delete('/:id',(req,res,next)=>{
  const id = req.params.id
  res.json({
    id,
    msg:`删除用户id:${id}`,
    status: 200
  })
})
// 更新id
userRouter.put('/:id',(req,res,next)=>{
  const id = req.params.id
  res.json({
    id,
    msg:`更新用户id:${id}`,
    status: 200
  })
})

userRouter.post('/',(req,res,next)=>{
  const body =req.body
  res.json({
    body,
    msg:`创建用户`,
    status: 200
  })
})

userRouter.post('')


// /users 根路由 匹配上面的所有路由
app.use('/users', userRouter)
app.listen(port,()=>{
  console.log(`Server running at http://localhost:${port}`)
})



