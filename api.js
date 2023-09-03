const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
var path = require("path");
var cors = require("cors");

const app = express();

// const database = "122";
const database = "coc-database"; // 部落冲突数据库
const databaseUrl = `mongodb://127.0.0.1:27017/${database}`;

// 老版本的 mongodb
var mongoose = require("mongoose");
mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("数据库连接成功");
});

// 定义一个导出数据的接口
app.get("/export", async (req, res) => {
  // 获取数据库中的集合对象
  const collection = db.collection("detaildatas");

  // 使用MongoDB的原生操作方法获取数据，例如find()
  const cursor = collection.find({});

  // 使用MongoDB的toArray()方法将查询结果转换为数组
  const result = await cursor.toArray();

  // 将获取到的数据导出为JSON格式
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(result));
});

// 创建路由
var detailRouter = require("./routes/index");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

// // 路由接口
app.use("/detail", detailRouter);

// 设置路由和请求处理程序
app.get("/", (req, res) => {
  res.send("接口项目已成功启动");
});

app.get("/get", (req, res) => {
  res.send("get接口项目已成功启动");
});
app.get("/data", (req, res) => {
  fs.readFile("./json/data.json", function (err, data) {
    if (!err) {
      res.writeHead(200, {
        "Content-Type": "text/html;charset=UTF-8",
      });
      res.end(data);
    } else {
      throw err;
    }
  });
});

app.get("/tableData", (req, res) => {
  fs.readFile("./json/tableData.json", function (err, data) {
    if (!err) {
      res.writeHead(200, {
        "Content-Type": "text/html;charset=UTF-8",
      });
      res.end(data);
    } else {
      throw err;
    }
  });
});

// 部落冲突 列表查询接口
app.get("/coc.quary", async (req, res) => {
  const collectionName = "build-test";
  // 获取数据库中的集合对象
  const collection = db.collection(collectionName);

  // 使用MongoDB的原生操作方法获取数据，例如find()
  const cursor = collection.find({});

  // 使用MongoDB的toArray()方法将查询结果转换为数组
  const result = await cursor.toArray();

  // 将获取到的数据导出为JSON格式
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(result));
});

// 解析请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 部落冲突 新增接口
app.post("/coc.add", (req, res) => {
  // 处理 POST 请求
  const data = req.body;
  // 验证请求体是否存在
  if (!data) {
    console.error("Request body is empty.");
    res.status(400).send("Request body is empty.");
    return;
  }
  const collectionName = "build-test";
  const collection = db.collection(collectionName);
  collection.insertOne(data, (err) => {
    if (err) throw err;
    console.log("文档已插入到集合中！");
  });
  res.send({
    databaseUrl,
    success: true,
    collectionName,
    data,
  });
});

// 部落冲突 删除接口
app.post("/coc.delete", (req, res) => {
  // 处理 POST 请求
  const data = req.body;
  // const data = req.body && JSON.stringify(req.body);
  // 验证请求体是否存在
  if (!data) {
    console.error("Request body is empty.");
    res.status(400).send("Request body is empty.");
    return;
  }
  const collectionName = "build-test";
  // // 定义集合模型
  // let tomSchema = mongoose.Schema({
  //   build: String,
  //   label: String,
  //   translate: String,
  // });
  // const collection = mongoose.model(collectionName, tomSchema);
  const collection = db.collection(collectionName);
  const dataID = data?.translate;
  collection.deleteOne({ translate: dataID }, function (err, value) {
    if (err) throw err;
    // console.log(`集合中${dataID}的数据已删除！`);
    res.send({
      databaseUrl,
      success: true,
      collectionName,
      value,
    });
  });
  // collection.deleteOne({ _id: dataID }).then(count => {
  //   res.send({
  //     databaseUrl,
  //     success: true,
  //     collectionName,
  //     count,
  //   });
  // }).catch(err => {
  //   console.error('Error deleting document:', err);
  // });
});

app.post("/test", (req, res) => {
  // 处理 POST 请求
  const data = req.body;
  // 验证请求体是否存在
  if (!data) {
    console.error("Request body is empty.");
    res.status(400).send("Request body is empty.");
    return;
  }
  res.send(data);
});

// 启动服务器
const port = 888; // 可以根据需要更改端口号
app.listen(port, () => {
  console.log(`服务器正在运行，监听端口 ${port}`);
});
