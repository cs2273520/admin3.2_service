// 引入mongoose 模块
const mongoose = require("mongoose");
///  mongodb 可视化工具  官方罗盘使用的
// mongodb+srv://qianfeng2012:654321AAAA@cluster0.ugafb.mongodb.net/test
// mongoose.connect('mongodb+srv://qianfeng2012:654321AAAA@cluster0.ugafb.mongodb.net/qianfeng2012?retryWrites=true&w=majority',{ useNewUrlParser: true , useUnifiedTopology: true })
mongoose.connect("mongodb://127.0.0.1:27017/admin", {
  useNewUrlParser: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// 连接成功
mongoose.connection.on("connected", () => {
  console.log("数据库连接成功");
});
// 连接断开
mongoose.connection.on("disconnected", () => {
  console.log("disconnected");
});
// 连接错误
mongoose.connection.on("error", () => {
  console.log("error");
});
// 连接成功之后 将模块暴露出来
module.exports.mongoose = mongoose;
