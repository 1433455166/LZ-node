const mongoose = require("mongoose");
//创建骨架
var detailSchema = mongoose.Schema({
    "pdsid" : String,
    "title" : String,
    "describe" : String,//作者
    "view" : Number,//播放量
    "imgurl" : String,
});
//创建模型
var detailModel = mongoose.model('123', detailSchema);
//暴露
module.exports = detailModel;
