/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");
const commonConst = require("../common/const");

const { IPAddress, database } = commonConst

const databaseUrl = `mongodb://${IPAddress}:27017/${database?.pdDatabase}`;

function ccLz(app) {
    const ccLzCollection = mongoose.createConnection(databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // 列表查询：cc.lz.easyQueryList
    app.post("/cc.lz.easyQueryList", async (req, res) => {
        // 处理 POST 请求
        const data = req.body;
        // 验证请求体是否存在
        if (!data) {
            console.error("Request body is empty.");
            res.status(400).send("Request body is empty.");
            return;
        }

        const collection = ccLzCollection.collection(data?.collection);

        // 使用MongoDB的原生操作方法获取数据，例如find()
        const cursor = collection?.find({});

        // 使用MongoDB的toArray()方法将查询结果转换为数组
        const result = await cursor.toArray();
        const arr = result.map((item) => {
            const { _id, ...others } = item;
            return others
        })

        // 将获取到的数据导出为JSON格式
        res.setHeader("Content-Type", "application/json");

        res.send({
            success: true,
            collectionName: data?.collection,
            data: arr,
        });
    });

    // 添加接口：cc.lz.easyAdd
    app.post("/cc.lz.easyAdd", (req, res) => {
        // 处理 POST 请求
        const data = req.body;
        // 验证请求体是否存在
        if (!data) {
            console.error("Request body is empty.");
            res.status(400).send("Request body is empty.");
            return;
        }
        const collection = ccLzCollection.collection(data?.collection);
        collection.insertOne(data?.data, (err) => {
            if (err) throw err;
            console.log("数据已添加到集合中！");
        });
        res.send({
            success: true,
            collectionName: data?.collection,
            data,
        });
    });

    // 删除接口：cc.lz.easyDelete
    app.post("/cc.lz.easyDelete", (req, res) => {
        // 处理 POST 请求
        const data = req.body;
        // 验证请求体是否存在
        if (!data) {
            console.error("Request body is empty.");
            res.status(400).send("Request body is empty.");
            return;
        }
        const dataID = data?.id;
        const collection = ccLzCollection.collection(data?.collection);
        collection.deleteOne({ id: dataID }, function (err, value) {
            if (err) throw err;
            res.send({
                success: true,
                collectionName: data?.collection,
                value,
            });
        });
    });

    // 编辑接口：cc.lz.easyEdit
    app.post("/cc.lz.easyEdit", (req, res) => {
        // 处理 POST 请求
        const data = req.body;
        // 验证请求体是否存在
        if (!data) {
            console.error("Request body is empty.");
            res.status(400).send("Request body is empty.");
            return;
        }
        const collection = ccLzCollection.collection(data?.collection);
        const { id, _id, ...othersData } = data?.data || {}
        collection.updateOne({ id: id }, {
            $set: { ...othersData }
        }, (err, value) => {
            if (err) throw err;
            res.send({
                success: true,
                collectionName: data?.collection,
                value,
            });
        });
    });

    // search 查询接口：cc.lz.easySearch
    app.post("/cc.lz.easySearch", (req, res) => {
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
        for (const i in data?.data) {
            newArr.push({ [i]: data?.data?.[i] })
        }
        const query = { $and: newArr };
        const collection = ccLzCollection.collection(data?.collection);
        collection.find(query).toArray()
            .then((docs) => {
                res.send({
                    success: true,
                    collectionName: data?.collection,
                    docs,
                });
            }).catch((err) => {
                console.error('查询失败：', err);
            });
    });
}

// 暴露
exports.fn = ccLz;