const express = require('express');
const app = express();
const path = require('path');

// 启动静态资源目录
app.use(express.static(path.join(__dirname, 'public')));

// 默认访问主页跳转到 pay.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 监听端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});