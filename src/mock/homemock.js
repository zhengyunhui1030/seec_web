let Mock = require("mockjs");
//  /aa 拦截
let arr = ['zhangsan','lisi','wangwu','zhaoliu']
// /api/aa
// Mock.mock("/api/aa","get",(options)=>{
//     console.log(options);  //{url:"/api/aa",type:"get",body:null}
//     return arr
// })
// 正则 /api/aa
Mock.mock(/\/api\/aa/,"get",(options)=>{
    console.log(options,"11");  //{url:"/api/aa",type:"get",body:null}
    return arr
})
Mock.mock("/api/ab","post",(options)=>{
    console.log(options,"10行");
    return {
        status:200,
        message:"success",
        data:arr
    }
})