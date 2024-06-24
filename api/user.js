// 方法
const utils = require("../utils");

function user (app, db) {
    // 用户注册接口
    app.post("/user.register", (req, res) => {
        // 处理 POST 请求
        const data = req.body;
        // 验证请求体是否存在
        if (!data) {
            console.error("Request body is empty.");
            res.status(400).send("Request body is empty.");
            return;
        }
        const collectionName = "user";
        const collection = db.collection(collectionName);
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
    });
}

//暴露
exports.user = user;