const mongoose = require("mongoose");
const utils = require("../utils");
const commonConst = require("../common/const");

const { ERROR_STATUS, collection, SESSION_EXPIRATION, IPAddress, database } = commonConst
const collectionName = collection.user

// 数据库集合地址
const databaseUrl = `mongodb://${IPAddress}:27017/${database.cocDatabase}`;

function user(app) {
    // 数据库连接
    const userCollection = mongoose.createConnection(databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const collection = userCollection.collection(collectionName);

    // 用户注册接口
    app.post("/user.register", async (req, res) => {
        // 处理 POST 请求
        const data = req.body;
        // 验证请求体是否存在
        if (!data) {
            console.error("Request body is empty.");
            res.status(400).send("Request body is empty.");
            return;
        }

        // 查询集合中的所有文档  
        const result = await collection.find({ userName: data?.userName }).toArray()
        if (result.length) {
            res.send({
                success: false,
                errorMessage: '用户名已存在，请重新编辑用户名',
                collectionName,
                data,
            });
        } else {
            collection.insertOne({
                ...data,
                userID: utils.getNumberId()
            }, (err) => {
                if (err) throw err;
                console.log("用户注册成功！");
            });

            res.send({
                success: true,
                collectionName,
                data,
            });
        }
    });

    // 用户登录接口
    app.post("/user.logIn", async (req, res) => {
        // 处理 POST 请求
        const data = req.body;
        // 验证请求体是否存在
        if (!data) {
            console.error("Request body is empty.");
            res.status(400).send("Request body is empty.");
            return;
        }

        // 查询集合中的所有文档  
        const result = await collection.find({ ...data }).toArray()
        if (!result.length) {
            res.send({
                success: false,
                errorMessage: '用户名或密码错误，请重新输入！',
                collectionName,
                data,
            });
        } else {
            const [user] = result
            // 设置一个名为 "userID" 的 cookie，其值为 "cookievalue"，过期时间为 1 小时（毫秒为单位）  
            res.cookie('userID', user?.userID, {
                expires: new Date(Date.now() + SESSION_EXPIRATION), // 1小时后过期  
                httpOnly: true, // 限制 cookie 只能被服务器访问，客户端无法访问  
                secure: true, // 通过 HTTPS 传输 cookie（仅在 HTTPS 下设置）  
            });

            // 设置 session 数据  
            req.session.userID = user?.userID;

            console.log("登录成功！");
            res.send({
                success: true,
                collectionName,
                data: {
                    ...data,
                    userID: user?.userID
                },
            });
        }
    });

    // 获取用户信息接口
    app.post("/user.get", async (req, res) => {
        // 处理 POST 请求
        const data = req.body;
        // 查询集合中的所有文档  
        const result = await collection.find({ userID: req.session.userID }).toArray()
        if (!data && !req.session.userID) {
            res.send({
                success: false,
                errorMessage: '用户登录过期，请重新登录！',
                errorStatus: ERROR_STATUS.SIGN_OUT,
            });
        } else if (!data && !result.length) {
            res.send({
                success: false,
                errorMessage: '用户名不存在，请注册！',
                collectionName,
                data,
            });
        } else if (data) {
            res.send({
                success: true,
                collectionName,
                data,
            });
        } else {
            const [user] = result
            res.send({
                success: true,
                collectionName,
                data: user,
            });
        }
    });
}

//暴露
exports.fn = user;