const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();

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
