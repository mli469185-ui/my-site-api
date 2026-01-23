// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 80;

// 静态资源
app.use(express.static(path.join(__dirname, 'public')));

// 微信验证文件访问
app.get('/MP_verify_bac8086101dafc31d3e972cc0a105335.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'MP_verify_bac8086101dafc31d3e972cc0a105335.txt'));
});

// 默认首页
app.get('/', (req, res) => {
  res.send('✅ 微信业务域名验证服务器运行正常');
});

// 启动服务
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});