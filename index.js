const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// ===== 微信 OAuth → NewPay H5（写死）=====
const TARGET_URL =
  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa98fa9e9a4371ad4&redirect_uri=https%3A%2F%2Fprod-h5-new.newpay.la%2FwechatPay%2FinputPrice%3FshopId%3D1985258708900089857&response_type=code&scope=snsapi_base&state=shop1985258708900089857&connect_redirect=1#wechat_redirect";

// ===== 微信业务域名校验 =====
const MP_VERIFY_TOKEN = "bac8086101dafc31d3e972cc0a105335";
const MP_VERIFY_FILENAME = `MP_verify_${MP_VERIFY_TOKEN}.txt`;

// ===== 静态目录 =====
app.use(express.static("public"));

// ===== 业务域名校验文件（根路径）=====
app.get(`/${MP_VERIFY_FILENAME}`, (req, res) => {
  res.type("text/plain");
  res.send(MP_VERIFY_TOKEN);
});

// ===== 中转路由：服务器 302 → OAuth（降低“将要访问”概率）=====
app.get("/go", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  return res.redirect(302, TARGET_URL);
});

// ===== 唯一入口：/wx.1（静态页，必须点按钮）=====
app.get("/wx.1", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  res.send(`<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>微信支付</title>
<style>
body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#f6f7f8;font-family:-apple-system,BlinkMacSystemFont;}
.box{background:#fff;padding:28px;border-radius:16px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.08)}
.btn{width:96px;height:96px;border-radius:22px;background:#07C160;display:flex;align-items:center;justify-content:center;text-decoration:none}
.btn svg{width:48px;height:48px;fill:#fff}
.tip{margin-top:14px;color:#666;font-size:13px}
</style>
</head>
<body>
<div class="box">
  <div>点击进入微信支付</div>
  <a class="btn" href="/go">
    <svg viewBox="0 0 1024 1024"><path d="M383.3 272.6c-177.6 0-321.6 121-321.6 270.3S205.7 813.2 383.3 813.2c49.2 0 95.8-7.2 138.5-20.4l105.7 58.6-29.8-89.7c64.9-51 106.2-127.1 106.2-209.8 0-149.3-144-270.3-321.6-270.3z"/></svg>
  </a>
  <div class="tip">必须点击按钮才会跳转</div>
</div>
</body>
</html>`);
});

// ===== 健康检查 =====
app.get("/health", (req, res) => res.send("ok"));

// ===== 其他路径全部拒绝 =====
app.get("*", (req, res) => res.status(403).send("Forbidden"));

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});