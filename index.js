const express = require("express");
const app = express();
const https = require("https");
const path = require("path");

const PORT = process.env.PORT || 3000;

// ===== 微信验证文件 =====
const VERIFY_TOKEN = "bac8086101dafc31d3e972cc0a105335";
const VERIFY_FILE = `MP_verify_${VERIFY_TOKEN}.txt`;

// ===== 收款目标链接 =====
const TARGET_URL = "https://prod-h5-new.newpay.la/wechatPay/inputPrice?shopId=1985258708900089857";

// ===== 静态资源目录 =====
app.use(express.static(path.join(__dirname, "public"), {
  maxAge: "1d",
  etag: false
}));

// ===== 微信验证文件 =====
app.get(`/${VERIFY_FILE}`, (req, res) => {
  res.type("text/plain").send(VERIFY_TOKEN);
});

// ===== 防封代理跳转（清除 referer + 隐藏真实来源） =====
app.get("/go", async (req, res) => {
  try {
    const headers = {
      "User-Agent": req.get("User-Agent") || "Mozilla/5.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Referer": "", // 清空来源
      "Cache-Control": "no-cache"
    };

    // 测试请求，确保目标可访问
    https.get(TARGET_URL, { headers }, () => {
      res.writeHead(302, {
        "Location": TARGET_URL,
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer"
      });
      res.end();
    }).on("error", err => {
      console.error("跳转失败：", err.message);
      res.status(502).send("Bad Gateway");
    });
  } catch (e) {
    res.status(500).send("Server Error");
  }
});

// ===== 微信入口页 =====
app.get("/wx.1", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>微信支付入口</title>
<style>
body { font-family: -apple-system, sans-serif; text-align:center; padding-top:20vh; background:#f6f7f8; }
a { display:inline-block; background:#07C160; color:#fff; padding:16px 28px; border-radius:8px; text-decoration:none; font-size:16px; }
a:active { opacity:0.8; }
</style>
</head>
<body>
<h2>点击进入微信支付</h2>
<a href="/go">进入支付</a>
</body>
</html>`);
});

// ===== 健康检查 =====
app.get("/health", (req, res) => res.send("ok"));

// ===== 拦截未定义路由 =====
app.use((req, res) => res.status(403).send("Forbidden"));

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));