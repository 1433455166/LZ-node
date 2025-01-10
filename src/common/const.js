// 常量文件 
module.exports = {  
    SESSION_EXPIRATION: 1000 * 60 * 60, // 1 个小时 设置 session 的过期时间（以毫秒为单位）  
    // COOKIE_EXPIRATION: 1000 * 60 * 60 * 24, // 设置 cookie 的过期时间（以毫秒为单位）  
    ERROR_STATUS: {
        SIGN_OUT: "SIGN_OUT"
    },
    collection: {
        coc: "build-test",
        user: "user"
    }
};