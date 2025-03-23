const mongoose = require("mongoose");
const commonConst = require("../common/const");
const { IPAddress, database } = commonConst

// 数据库集合地址
const databaseUrl = `mongodb://${IPAddress}:27017/${database.pdDatabase}`;

function user(app) {
    // 数据库连接
    const userCollection = mongoose.createConnection(databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    // c端用户信息更细接口
    app.post("/cc.lz.cUser.update", (req, res) => {
    // 处理 POST 请求
    const data = req.body;
    // 验证请求体是否存在
    if (!data) {
        console.error("Request body is empty.");
        res.status(400).send("Request body is empty.");
        return;
    }
    const collection = userCollection.collection(data?.collection);
    const { email, ...othersData } = data?.data || {}
    collection.updateOne({ email: email }, {
        $set: { ...othersData }
    }, (err) => {
        if (err) throw err;
        res.send({
            success: true,
            collectionName: data?.collection,
            data: data?.data,
        });
    });
});
}

//暴露
exports.fn = user;