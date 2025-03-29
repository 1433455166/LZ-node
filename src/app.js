/* eslint-disable no-constant-binary-expression */
const express = require("express");

const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require('cors');
// 文件格式转换
const sharp = require('sharp');
// var cors = require("cors");

const user = require("./routes/user");
const bTestUser = require("./routes/b-test-user");
const coc = require("./routes/coc");
const loginVerification = require("./routes/loginVerification");
const getIp = require("./routes/getIp");
const ccLz = require("./utils/ccLz");
const fileFn = require("./utils/file");

const commonConst = require("./common/const");

const { SESSION_EXPIRATION, PUBLIC, IPAddress } = commonConst

const session = require('express-session');

// 一个处理文件上传的中间件
const multer = require('multer');

// 设置上传文件的存储路径  
const upload = multer({ dest: 'uploads/' }); // 临时存储路径，你需要根据实际情况设置  

const app = express();
// 设置静态文件目录
app.use('/files', express.static(path.join(__dirname, '../public')));
// 允许所有来源的请求
// app.use(cors());
// 或者指定特定的来源
const corsOptions = {
    origin: ['http://localhost:8080', 'http://localhost:3001', "http://192.168.31.172:8080"], // 允许的源列表
};
app.use(cors(corsOptions));

// 设置路由和请求处理程序
app.get("/", (req, res) => {
    res.send("接口项目已成功启动");
});

app.get("/get", (req, res) => {
    res.send("get接口项目已成功启动");
});

// app.use(cors());

// 设置 session 秘钥（必须）  
const secretKey = 'LZ-secret-key'; // 请替换为你自己的秘钥  

// 使用 session 中间件  
app.use(session({
    secret: secretKey, // 用于签署 session ID cookie 的秘钥  
    resave: false, // 强制将 session 保存到 session store 中，即使 session 没有被修改  
    saveUninitialized: true, // 强制将未初始化的 session 保存到 session store 中。一个新的、未初始化的 session 将被保存在 session store 中，当 session 是 "new" 时，但在中间件链中没有被修改。默认为 true，但将其设置为 false 可以帮助减少存储在 session store 中的数据量，特别是当使用 cookie-sessions 时。  
    cookie: {
        maxAge: SESSION_EXPIRATION, // 设置 session cookie 的过期时间（以毫秒为单位）  
    },
    // 可以添加其他 session store 选项，如使用 Redis、MongoDB 等  
}));
// 解析请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 确保上传目录存在
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
// 图片上传接口
app.post("/picture.upload", upload.single('file'), (req, res) => {
    // req.body 将包含文本域的数据，如果有的话 
    if (req?.body?.uploadAddress) {
        fileFn?.obj?.ensureUploadDirExists(`${PUBLIC}/images/${`${req?.body?.uploadAddress}`}`)
    }
    // req.file 是 'file' 字段的文件信息 
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    // 假设您有一个名为'input.jpg'的图像文件，并且您想要将其转换为PNG格式并保存为'output.png'
    const inputFilePath = path.join(uploadDir, req.file.filename);
    const outputFilePath = `${PUBLIC}/images/${req?.body?.uploadAddress ? `${req?.body?.uploadAddress}/` : ''}${req.file.originalname}`;
    sharp(inputFilePath)
        .toFormat('png')
        .toFile(outputFilePath, (err) => {
            if (err) {
                console.error('Error:', err);
            } else {
                // 转换成功后删除原文件
                fs.unlink(inputFilePath, (err) => {
                    if (err) {
                        console.error('删除原始文件时出错:', err);
                    } else {
                        console.log('原始文件删除成功！');
                    }
                });
            }
        }); 
   
    // 你可以在这里对文件进行进一步的处理，比如重命名、保存到数据库等  
    // 例如，你可以将文件移动到永久存储位置，并更新文件路径到数据库  

    // 假设我们只是简单地返回上传成功的信息和文件路径（此处为临时路径）  
    const filePath = `http://${IPAddress}:888/files/images/${`${req?.body?.uploadAddress}/` || ''}${req.file.originalname}`;
    return res.json({
        status: 'success',
        message: 'File uploaded successfully.',
        filePath
    });
});
// 部落冲突测试 相关
coc.fn(app)
// 登录验证
loginVerification.fn(app)
// 用户相关
bTestUser.fn(app)
user.fn(app)
// 简单的列表接口组件
ccLz.fn(app)
// 获取IP
getIp.fn(app)

// 默认的路由，用于处理未匹配到的请求
app.get('*', (req, res) => {
    res.status(404).send('Not Found');
});

// 启动服务器
const port = 888; // 可以根据需要更改端口号
app.listen(port, () => {
    console.log(`服务器正在运行，监听端口 ${port}`);
});
