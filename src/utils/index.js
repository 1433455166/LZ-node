const commonConst = require("../common/const");

const { IPAddress } = commonConst
// 生成唯一 17 位的数字
function getNumberId () {
    return Number(Date.now() + Math.random().toString().substring(2, 6))
}

// 获取 databaseUrl
const getDatabaseUrl = (database) => `mongodb://${IPAddress}:27017/${database}`

//暴露
// exports.getNumberId = getNumberId;
// exports.getDatabaseUrl = getDatabaseUrl;

exports = {
    getNumberId,
    getDatabaseUrl
}