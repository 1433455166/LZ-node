const express = require("express");

const bodyParser = require("body-parser");
const fs = require("fs");
var path = require("path");
var cors = require("cors");

// 用户接口文件
const user = require("./api/user");

const session = require('express-session');

// 一个处理文件上传的中间件
const multer = require('multer');

// 设置上传文件的存储路径  
const upload = multer({ dest: '../uploads/' }); // 临时存储路径，你需要根据实际情况设置  

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

// 设置 session 秘钥（必须）  
const secretKey = 'your-secret-key'; // 请替换为你自己的秘钥  

// 使用 session 中间件  
app.use(session({
    secret: secretKey, // 用于签署 session ID cookie 的秘钥  
    resave: false, // 强制将 session 保存到 session store 中，即使 session 没有被修改  
    saveUninitialized: true, // 强制将未初始化的 session 保存到 session store 中。一个新的、未初始化的 session 将被保存在 session store 中，当 session 是 "new" 时，但在中间件链中没有被修改。默认为 true，但将其设置为 false 可以帮助减少存储在 session store 中的数据量，特别是当使用 cookie-sessions 时。  
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 设置 session cookie 的过期时间（以毫秒为单位）  
    },
    // 可以添加其他 session store 选项，如使用 Redis、MongoDB 等  
}));

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

    // 设置一个名为 "mycookie" 的 cookie，其值为 "cookievalue"，过期时间为 1 小时（毫秒为单位）  
    res.cookie('mycookie', 'cookievalue', {
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1小时后过期  
        httpOnly: true, // 限制 cookie 只能被服务器访问，客户端无法访问  
        // secure: true, // 通过 HTTPS 传输 cookie（仅在 HTTPS 下设置）  
    });

    // 设置 session 数据  
    req.session.username = 'John Doe';
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
    const dataID = data?.id;
    collection.deleteOne({ id: dataID }, function (err, value) {
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

// 部落冲突 编辑接口
app.post("/coc.edit", (req, res) => {
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
    collection.updateOne({ id: data.id }, {
        $set: {
            build: data.build,
            label: data.label,
            translate: data.translate,
            image: data.image,
        }
    }, (err, value) => {
        if (err) throw err;
        res.send({
            databaseUrl,
            success: true,
            collectionName,
            value,
        });
    });
});

// 部落冲突 search查询接口
app.post("/coc.search", (req, res) => {
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
    // 定义多个查询条件  
    const newArr = []
    for (const i in data) {
        newArr.push({ [i]: data[i] })
    }
    const query = { $and: newArr };
    collection.find(query).toArray()
        .then((docs) => {
            res.send({
                databaseUrl,
                success: true,
                collectionName,
                docs,
            });
        }).catch((err) => {
            console.error('查询失败：', err);
        });
});

// 图片上传接口
app.post("/picture.upload", upload.single('file'), (req, res) => {
    // req.file 是 'file' 字段的文件信息  
    // req.body 将包含文本域的数据，如果有的话  
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // 你可以在这里对文件进行进一步的处理，比如重命名、保存到数据库等  
    // 例如，你可以将文件移动到永久存储位置，并更新文件路径到数据库  

    // 假设我们只是简单地返回上传成功的信息和文件路径（此处为临时路径）  
    const filePath = req.file.destination + req.file.filename;
    return res.json({ status: 'success', message: 'File uploaded successfully.', filePath });
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

user.user(app, db)

// 启动服务器
const port = 888; // 可以根据需要更改端口号
app.listen(port, () => {
    console.log(`服务器正在运行，监听端口 ${port}`);
});
