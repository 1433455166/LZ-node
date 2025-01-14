// 常量文件 
module.exports = {  
    // 1 个小时 设置 session 的过期时间（以毫秒为单位）
    SESSION_EXPIRATION: 1000 * 60 * 60,   
    // COOKIE_EXPIRATION: 1000 * 60 * 60 * 24, // 设置 cookie 的过期时间（以毫秒为单位）  
    // 错误状态
    ERROR_STATUS: {
        SIGN_OUT: "SIGN_OUT",
    },
    // 数据库集合列表
    collection: {
        coc: "build-test",
        user: "user",
    },
    // 静态文件根目录名
    public: 'public',
    // ip 地址
    IPAddress: '127.0.0.1',
};