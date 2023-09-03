const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
var path = require("path");
var cors = require("cors");

// 百度chatGPT
// const MongoClient = require("mongodb").MongoClient;

// const uri = "mongodb://127.0.0.1:27017"; // MongoDB连接字符串，包含用户名、密码和数据库名等信息。
// const client = new MongoClient(uri, {});
// console.log({ client });
// client.connect((err) => {
//   if (err) {
//     console.log({ err });
//     throw err;
//   }
//   console.log("已成功连接到数据库！");

//   const collection = client.db("122").collection("123"); // 指定要连接的数据库和集合名称。
//   const document = { name: "John Doe", age: 30 }; // 要插入的文档。

//   collection.insertOne(document, function (err, result) {
//     if (err) throw err;
//     console.log("文档已插入到集合中！");

//     client.close(); // 关闭数据库连接。
//   });
// });

const app = express();

// 老版本的 mongodb
var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/122", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("数据库连接成功");
});

// 定义一个导出数据的接口
app.get('/export', async (req, res) => {
  // 获取数据库中的集合对象
  const collection = db.collection('detaildatas');

  // 使用MongoDB的原生操作方法获取数据，例如find()
  const cursor = collection.find({});

  // 使用MongoDB的toArray()方法将查询结果转换为数组
  const result = await cursor.toArray();

  // 将获取到的数据导出为JSON格式
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(result));
});

// 等待Mongoose连接成功
// db.once("connected", () => {
//   console.log("Connected to MongoDB");

//   // 获取数据库中的集合
//   const collection = db.collection("detaildatas");
//   // 创建游标
//   const cursor = collection.find({});

//   // 处理游标中的每个文档
//   const arr = [];
//   cursor.forEach((doc, err) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     arr.push(doc);
//     // console.log(doc);
//   });
//   app.get("/api/users", (req, res) => {
//     collection.find((err, users) => {
//       if (err) {
//         res.status(500).send(err);
//         return;
//       }
//       res.json(arr);
//     });
//   });
// });

// // 断开Mongoose连接
// mongoose.connection.close((err) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log('Disconnected from MongoDB');
// });
// });

// const collection = db.collection("detaildatas");
//  // 执行查询操作
//  collection.find({}).toArray((err, docs) => {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   // 处理查询结果
//   docs.forEach(doc => {
//     console.log(doc);
//   });

//   // // 断开Mongoose连接
//   // mongoose.connection.close((err) => {
//   //   if (err) {
//   //     console.error(err);
//   //     return;
//   //   }
//   //   console.log('Disconnected from MongoDB');
//   // });
// });

// const UserSchema = new mongoose.Schema({
//   a: Number,
//   b: Number
// });

// const User = mongoose.model('detaildatas', UserSchema);
// User.find((err, users) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(users);
// });
// app.get('/api/users', (req, res) => {
//   User.find((err, users) => {
//     if (err) {
//       res.status(500).send(err);
//       return;
//     }
//     res.json(users);
//   });
// });

// const collection = mongoose.connection.collection("123");
// const document = { name: "John Doe", age: 30 };
// collection.insertOne(document, function (err, result) {
//   if (err) throw err;
//   console.log("文档已插入到集合中！");
// });
// collection
//   .find({})
//   .then((documents) => {
//     documents.forEach((document) => {
//       console.log(document);
//     });
//   })
//   .catch((err) => {
//     throw err;
//   });
// app.get("/databaseData", (req, res) => {
//   res.writeHead(200, {
//     "Content-Type": "text/html;charset=UTF-8",
//   });
//   res.end(collection);
// });
// console.log({ collection });
// mongoose.connection.close();
// // 创建路由
var detailRouter = require("./routes/index");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
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

// app.use(express.json()); // 处理 JSON 请求体

// 解析请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/test", (req, res) => {
  // 处理 POST 请求
  const data = req.body;
  // 验证请求体是否存在
  if (!data) {
    console.error("Request body is empty.");
    res.status(400).send("Request body is empty.");
    return;
  }
  // 在这里执行您想要的操作，例如将数据存储到数据库中
  //   res.writeHead(200, {
  //     "Content-Type": "application/json",
  //   });
  res.send(data);
  //   res.end("POST 请求已成功处理");
});

// 启动服务器
const port = 888; // 可以根据需要更改端口号
app.listen(port, () => {
  console.log(`服务器正在运行，监听端口 ${port}`);
});
