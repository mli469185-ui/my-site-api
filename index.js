const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 3000;

// ===== 微信 OAuth (NewPay H5 收款入口) =====
const TARGET_URL =
  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa98fa9e9a4371ad4&redirect_uri=https%3A%2F%2Fprod-h5-new.newpay.la%2FwechatPay%2FinputPrice%3FshopId%3D1985258708900089857&response_type=code&scope=snsapi_base&state=shop1985258708900089857&connect_redirect=1#wechat_redirect";

// ===== 微信业务域名验证 =====
const MP_VERIFY_TOKEN = "bac8086101dafc31d3e972cc0a105335";
const MP_VERIFY_FILENAME = `MP_verify_${MP_VERIFY_TOKEN}.txt`;

// ===== 静态目录 =====
app.use(express.static(path.join(__dirname, "public")));

// ===== 微信验证文件 =====
app.get(`/${MP_VERIFY_FILENAME}`, (req, res) => {
  res.type("text/plain").send(MP_VERIFY_TOKEN);
});

// ===== 中转路由（防止“将要访问”提示）=====
app.get("/go", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.redirect(302, TARGET_URL);
});

// ===== 自适应收款页 =====
app.get("/wx.1", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  res.send(`<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<title>微信收款入口</title>
<style>
  :root {
    --green: #07C160;
    --gray: #666;
    --bg: #f6f7f8;
  }
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body {
    margin: 0;
    padding: 0;
    height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
  }
  .container {
    text-align: center;
    background: #fff;
    padding: 28px 32px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.06);
    max-width: 300px;
  }
  .title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #222;
  }
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    margin: 0 auto;
    border-radius: 24px;
    background: var(--green);
    text-decoration: none;
    transition: transform .15s ease;
  }
  .btn:active {
    transform: scale(0.96);
  }
  .btn svg {
    width: 48px;
    height: 48px;
    fill: #fff;
  }
  .tip {
    margin-top: 16px;
    color: var(--gray);
    font-size: 13px;
  }
  @media (max-width: 400px) {
    .container { max-width: 85%; padding: 24px; }
  }
</style>
</head>
<body>
  <div class="container">
    <div class="title">点击进入微信支付</div>
    <a class="btn" href="/go" rel="noopener">
      <svg viewBox="0 0 1024 1024"><path d="M383.3 272.6c-177.6 0-321.6 121-321.6 270.3S205.7 813.2 383.3 813.2c49.2 0 95.8-7.2 138.5-20.4l105.7 58.6-29.8-89.7c64.9-51 106.2-127.1 106.2-209.8 0-149.3-144-270.3-321.6-270.3z"/></svg>
    </a>
    <div class="tip">请点击上方按钮进入支付</div>
  </div>
  <script>
    // 修复 iOS Safari 点击延迟
    document.addEventListener('touchstart', function(){}, {passive: true});
  </script>
</body>
</html>`);
});

// ===== 健康检查 =====
app.get("/health", (req, res) => res.send("ok"));

// ===== 其他路径拒绝访问 =====
app.get("*", (req, res) => res.status(403).send("Forbidden"));

app.listen(PORT, () => console.log(\`✅ Server running on port \${PORT}\`));