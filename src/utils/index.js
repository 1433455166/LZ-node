// 生成唯一 17 位的数字
function getNumberId () {
    return Number(Date.now() + Math.random().toString().substring(2, 6))
}

//暴露
exports.getNumberId = getNumberId;