var express = require("express");
var router = express.Router();
const Detail = require("../models/detail");

//声音剧纵向排列商品路由接口
router.get("/detail", function (req, res, next) {
  Detail.find((err, doc) => {
    console.log(doc);
    if (err) throw err;
    res.json({
      status: 0,
      result: doc,
    });
  });
});

module.exports = router;
