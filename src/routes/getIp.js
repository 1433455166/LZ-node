const commonConst = require("../common/const");
const commonDataSource = require("../common/dataSource");
const { IPINFO_TOKEN, CN } = commonConst
const { PROVINCES } = commonDataSource

// 获取 IP
function getIp(app) {
    async function getPublicIp() {
        const services = [
            // 'https://api.ipify.org?format=json',
            'https://api64.ipify.org?format=json',
            'https://ipinfo.io/json',
            'https://checkip.amazonaws.com',
        ];

        for (const service of services) {
            try {
                let response;
                if (service.includes('checkip.amazonaws.com')) {
                    response = await fetch(service);
                    const ip = await response.text();
                    return ip.trim(); // 返回纯文本格式的 IP 地址
                } else {
                    response = await fetch(service);
                    const data = await response.json();
                    return data.ip || data.IP; // 根据不同服务的返回格式提取 IP
                }
            } catch {
                console.warn(`请求 ${service} 失败，尝试下一个服务...`);
            }
        }

        throw new Error('所有服务均不可用，无法获取公网 IP 地址');
    }
    app.get('/cc.lz.getPublicIP', async (req, res) => {
        const ip = await getPublicIp();
        if (ip) {
            res.json({ 
                ip,
                success: true,
            });
        }
    });
    // 获取地理位置
    app.get('/cc.lz.getLocation', async (req, res) => {
    try {
        // 获取公网 IP 地址
        const ip = await getPublicIp();
        // 获取地理位置
        const locationResponse = await fetch(`https://ipinfo.io/${ip}/json?token=${IPINFO_TOKEN}`);
        if (!locationResponse.ok) throw new Error('无法获取地理位置');
        const locationData = await locationResponse.json();
        const { country, region } = locationData
        if (country == CN) {
            res.json({
                data: PROVINCES.find((provin) => provin?.name === region)?.easy_name || country,
                success: true
            }); // 返回地理位置信息
        } else {
            res.json({
                data: country,
                success: true
            }); // 返回地理位置信息
        }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '无法获取位置' });
    }
  });
}
// 暴露
exports.fn = getIp;