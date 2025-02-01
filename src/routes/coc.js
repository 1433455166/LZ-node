const commonConst = require("../common/const");

const { collection, IPAddress, database } = commonConst
const collectionName = collection.coc

const databaseUrl = `mongodb://${IPAddress}:27017/${database.cocDatabase}`;

// 老版本的 mongodb
const mongoose = require("mongoose");

function coc(app) {
    const cocCollection = mongoose.createConnection(databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    
    // 获取数据库中的集合对象
    const collection = cocCollection.collection(collectionName);

    // 部落冲突 列表查询接口
    app.get("/coc.quary", async (req, res) => {
        // 使用MongoDB的原生操作方法获取数据，例如find()
        const cursor = collection.find({});

        // 使用MongoDB的toArray()方法将查询结果转换为数组
        const result = await cursor.toArray();

        // 将获取到的数据导出为JSON格式
        res.setHeader("Content-Type", "application/json");

        // 登录态才会获取数据
        // if (req.session.userID) {
        //     res.send({
        //         success: true,
        //         collectionName,
        //         data: JSON.stringify(result),
        //     });
        // } else {
        //     res.send({
        //         success: false,
        //         errorStatus: ERROR_STATUS.SIGN_OUT,
        //         errorMessage: '未登录，无法获取数据',
        //     });
        // }

        res.send({
            success: true,
            collectionName,
            data: JSON.stringify(result),
        });
    });

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
        collection.insertOne(data, (err) => {
            if (err) throw err;
            return;
        });
        res.send({
            success: true,
            collectionName,
            data,
        });
        console.log("文档已插入到集合中！");
    });

    // 部落冲突 删除接口
    app.post("/coc.delete", (req, res) => {
        // 处理 POST 请求
        const data = req.body;
        // 验证请求体是否存在
        if (!data) {
            console.error("Request body is empty.");
            res.status(400).send("Request body is empty.");
            return;
        }
        const dataID = data?.id;
        collection.deleteOne({ id: dataID }, function (err, value) {
            if (err) throw err;
            res.send({
                success: true,
                collectionName,
                value,
            });
        });
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
        // 定义多个查询条件  
        const newArr = []
        for (const i in data) {
            newArr.push({ [i]: data[i] })
        }
        const query = { $and: newArr };
        collection.find(query).toArray()
            .then((docs) => {
                res.send({
                    success: true,
                    collectionName,
                    docs,
                });
            }).catch((err) => {
                console.error('查询失败：', err);
            });
    });
}

// 暴露
exports.fn = coc;