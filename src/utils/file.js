const fs = require('fs');
// 确保目录存在，如果不存在则创建它
function ensureUploadDirExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directory created at ${dirPath}`);
    } else {
        console.log(`Directory already exists at ${dirPath}`);
    }
}

// 暴露
exports.obj = {
    ensureUploadDirExists
};