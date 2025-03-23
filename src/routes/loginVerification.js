const nodemailer = require('nodemailer');
const mongoose = require("mongoose");
const { MY_EMAIL, AUTHORIZATION_CODE, IPAddress, database, collection: coll } = require('../common/const');

const databaseUrl = `mongodb://${IPAddress}:27017/${database?.pdDatabase}`;
// 登录验证
function loginVerification(app) {
    const ccLzCollection = mongoose.createConnection(databaseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // 用于存储验证码的内存对象
    const verificationCodes = {};

    // 配置 Nodemailer 使用授权码
    const transporter = nodemailer.createTransport({
        // service: 'gmail', // 或者你的邮件服务商
        host: 'smtp.qq.com', // QQ 邮箱的 SMTP 服务器地址
        port: 587, // SMTP 服务器的端口号
        secure: false, // true 表示使用 SSL 协议，默认为 465 端口；false 则使用 TLS 协议，默认为 587 端口
        auth: {
            user: MY_EMAIL, // 你的邮箱地址
            pass: AUTHORIZATION_CODE, // 你从邮箱服务提供商处获取的授权码
        }
    });
    // 生成随机验证码
    function generateRandomCode() {
        return Math.floor(1000 + Math.random() * 9000).toString(); // 生成4位数验证码
    }

    // 注册接口：发送验证码
    app.post('/cc.lz.register.sendCode', async (req, res) => {
        const { email } = req.body;
        const code = generateRandomCode();

        // 存储验证码到内存中，并设置过期时间为120秒（2分钟）
        verificationCodes[email] = { code, expiresAt: Date.now() + 120 * 1000 };

        const mailOptions = {
            from: `狼族 ${MY_EMAIL}`,
            to: email,
            subject: '你的邮箱验证码',
            // text: `您的验证码是 ${code}，请妥善保管。`
            text: `您的验证码是 ${code}，请妥善保管。`, // 纯文本版本
            html: `<h2>欢迎注册我们的服务</h2>
                   <p>您的验证码是 <strong>${code}</strong>，请妥善保管。</p>
                   <p>此验证码将在2分钟后失效。</p>
                   <style>
                       h2 { color: #333; }
                       p { font-size: 16px; color: #666; }
                       strong { color: red; }
                   </style>` // HTML 版本，包含内联样式
        };

        // transporter.sendMail(mailOptions, function(error, info){
        transporter.sendMail(mailOptions, function(error){
            if (error) {
                console.error(error);
                return res.status(500).send('发送失败');
            }
            // console.log('Email sent: ' + info.response);
            res.status(200).send({
                success: true,
                text: '验证码已发送，请查收邮件',
            });
        });
    });
    // 验证验证码接口
    app.post('/cc.lz.register.verifyCode', async (req, res) => {
        const { email, code } = req.body;

        if (!verificationCodes[email]) {
            return res.status(400).send('未找到对应的验证码');
        }
    
        const { code: storedCode, expiresAt } = verificationCodes[email];
    
        if (Date.now() > expiresAt) {
            delete verificationCodes[email]; // 清理过期的验证码
            return res.status(400).send('验证码已过期');
        }
    
        if (storedCode === code) {
            delete verificationCodes[email]; // 验证成功后删除验证码
            const collection = ccLzCollection.collection(coll?.pdUsers);
            const user = await collection.findOne({ email });
            if (!user) {
                collection.insertOne({ email }, (err) => {
                    if (err) throw err;
                });
            }
            res.status(200).send({
                success: true,
                text: '验证码正确',
                data: user,
            });
        } else {
            res.status(400).send('验证码错误');
        }
    });
}
// 暴露
exports.fn = loginVerification;