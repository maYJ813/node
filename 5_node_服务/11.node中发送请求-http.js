
const http = require("http");


// 1.使用http 发送get请求
// http.get("http://localhost:3000", (res) => {
//   res.on("data", (chunk) => {
//     // console.log(chunk.toString())
//     console.log(JSON.parse(chunk))
//   })
// })

//2.http 发送post 请求
http.request({
  method: "POST",
  hostname: "localhost",
  port: 3000,
  path: "/",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "tom", age: 20 }),
})
 .on("response", (res) => {
  res.on("data", (chunk) => {
    console.log(JSON.parse(chunk))
  });
})
.end();

