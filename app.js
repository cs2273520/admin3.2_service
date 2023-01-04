const express = require("express");
const app = express();
const port = 3003;
const cors = require("cors");
const user = require("./sql/user.js");
const menus = require("./sql/menus");
const mechanism = require("./sql/mechanism");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const multer = require("multer");
//跨域 谁都跨域访问我的服务器 即便vue和我不是一个域名和端口
//练习中使用很完美 因为我不是公网ip 也就只能我一个人访问
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// 中间件，校验
const passwdCrypt = (req, res, next) => {
  var passwd = req.query.password;
  req.query.passwdCrypted = md5(passwd);
  next();
};
//token校验
const checkToken = function (req, res, next) {
  // console.log("我进入校验token识别 这一步了");
  // console.log("token");
  // console.log(req.query);
  // console.log(req.headers.authorization);
  // 怎么样都可以传  这只是一种传递方式  能过来让服务器看见token就可以了
  let _token = req.headers.authorization;
  //这里要做 更合理的  各种情况的处理
  try {
    // jwt引擎 反推这个秘文  是否是我给你的  是的话 把你秘文变成你的 用户信息 还原
    let verify = jwt.verify(_token, jwt_secret);
    if (verify) {
      req.query.user_info = verify;
      next();
      return verify;
    }
  } catch (error) {
    res.send({
      code: "888",
      info: "用户暂无权限,请重新登录",
    });
  }
};

const jwt_secret = "xiaochangfu";
// 登录
app.post("/api/Login", async (req, res) => {
  let { username, password } = req.body;
  let result = await user.findOne({
    username,
    password,
  });

  if (result) {
    res.send({
      status: 200,
      info: "success",
      data: {
        _token: jwt.sign(
          {
            // userId:result.userId,
            username: username,
            password: password,
          },
          jwt_secret
          // { expiresIn: 60*60*60}
        ),
      },
    });
  } else {
    res.send({
      status: 888,
      info: "用户名或密码错误",
    });
  }
});
//左侧菜单列表
app.get("/api/menus", checkToken, async (req, res) => {
  // let mobile = req.query.mobile
  // console.log(req.query);
  let result = await menus.find();
  if (result) {
    res.send({
      status: 200,
      info: "success",
      data: result,
    });
  } else {
    res.send({
      status: 888,
      info: "用户名或密码错误",
    });
  }
});
//获取机构列表
app.get("/api/getMechanism", checkToken, async (req, res) => {
  console.log(req.query);
  const { pagenum, pagesize, query } = req.query;
  const total = await mechanism.find();
  if (query !== "") {
    const result1 = await mechanism
      .find({
        name: {
          $regex: query,
        },
      })
      .limit(pagesize * 1)
      .skip(pagesize * pagenum - pagesize);
    if (result1) {
      res.send({
        status: 200,
        info: "success",
        data: result1,
        total: total.length,
      });
    } else {
      res.send({
        status: 888,
        info: "用户名或密码错误",
      });
    }
  } else {
    const result2 = await mechanism
      .find()
      .limit(pagesize * 1)
      .skip(pagesize * pagenum - pagesize);
    if (result2) {
      res.send({
        status: 200,
        info: "success",
        data: result2,
        total: total.length,
      });
    } else {
      res.send({
        status: 888,
        info: "用户名或密码错误",
      });
    }
  }
});
//添加机构
app.post("/api/addMechansim", checkToken, async (req, res) => {
  const data = req.body;
  console.log("机构信息", data);
  const result = await mechanism.findOne({ name: data.name });
  if (result) {
    res.send({
      status: 416,
      info: "该机构名已存在，请核查",
    });
  } else {
    const result1 = await mechanism.insertMany(data);

    if (result1) {
      res.send({
        status: 200,
        info: "数据添加成功",
      });
    } else {
      res.send({
        status: 416,
        info: "数据添加失败",
      });
    }
  }
});
//修改机构信息
app.post("/api/editMechansim", checkToken, async (req, res) => {
  const data = req.body;
  const result = await mechanism.updateOne({ _id: data._id }, { $set: data });
  if (result) {
    res.send({
      status: 200,
      info: "更新成功",
    });
  } else {
    res.send({
      status: 403,
      info: "更新失败",
    });
  }
});
//删除密码
app.post("/api/checkAuthority", checkToken, async (req, res) => {
  const data = req.body;
  const result = await user.find({ authority: data });
  if (result) {
    res.send({
      status: 200,
      info: "鉴权成功",
    });
  } else {
    res.send({
      status: 403,
      info: "鉴权失败",
    });
  }
});
// 删除机构信息
app.post("/api/delMechansim", checkToken, async (req, res) => {
  const data = req.body;
  const result = await mechanism.findByIdAndRemove({ _id: data._id });
  if (result) {
    res.send({
      status: 200,
      info: "删除成功",
    });
  } else {
    res.send({
      status: 403,
      info: "删除失败",
    });
  }
});
//图片上传
const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, "./data/Mechansim");
  },
  filename: function (req, file, cd) {
    // console.log("文件信息", file);
    // console.log("文件参数", req.body);
    const name = req.body.name;
    // const type = file.originalname.replace(/.+\./, ".");
    cd(null, name + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post(
  "/api/uploadImages",
  upload.array("file", 10),
  function (req, res, next) {
    // 获取文件信息
    const data = req.files;
    console.log("图片信息", data);
    // 将图片路径保存在数据库;
    mechanism.updateMany({ image1: data.filename });
  }
);
//图片上传

// 注册
app.post("/Register", passwdCrypt, async (req, res) => {
  console.log("zhuce我进来了");
  // 拿get请求的参数 req.query
  //post 请求 req.body
  var obj = {
    mobile: req.query.mobile,
    password: req.query.passwdCrypted,
  };
  user.findOne(
    {
      mobile: req.query.mobile,
    },
    (err, data) => {
      if (err) {
        console.log(err);
      }
      if (data) {
        res.send({
          code: "409",
          message: "已经注册过了",
        });
      } else {
        // 如果没注册  开始注册 注册好了 进login页面 让他登录
        user.insertMany(obj, (err, data) => {
          if (err) {
            console.log("err", err);
          }
          console.log(data);
          //数据库有他就可以进入 /login
          res.send({
            code: "200",
            msg: data,
            message: "注册成功",
          });
        });
      }
    }
  );
});

// 详情页商品数据
app.get("/GetDetail", async (req, res) => {
  console.log("我进来了详情页");
  let id = req.query.id;
  var resule = await detail.findOne({
    id,
  });
  if (resule) {
    res.send({
      code: "200",
      info: "success",
      data: resule,
    });
  } else {
    res.send({
      code: "999",
      info: "商品数据不存在",
    });
  }
});

// 用户数据持久化
app.get("/userInfo", checkToken, (req, res) => {
  console.log("我进来了用户数据持久化");
  console.log(req.query.user_info);
  res.send({
    code: "200",
    info: "success",
    info2: req.query.user_info,
  });
});
const path = require("path");
// 获取静态文件路径
app.use("/data", express.static(path.join(__dirname + "/data/Mechansim")));

app.listen(port, () => {
  console.log("后端端口启动在" + port + "了!");
});
