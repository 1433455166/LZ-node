const commonConst = require("../common/const");

const { collection } = commonConst
const collectionName = collection.coc

function ccLz(app, db) {
    // 获取数据库中的集合对象
    const collection = db.collection(collectionName);

    // 列表查询：cc.lz.easyQueryList
    app.get("/cc.lz.easyQueryList", async (req, res) => {
        // 使用MongoDB的原生操作方法获取数据，例如find()
        const cursor = collection.find({});

        // 使用MongoDB的toArray()方法将查询结果转换为数组
        const result = await cursor.toArray();

        // 将获取到的数据导出为JSON格式
        res.setHeader("Content-Type", "application/json");

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
            console.log("文档已插入到集合中！");
        });
        res.send({
            success: true,
            collectionName,
            data,
        });
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
exports.fn = ccLz;