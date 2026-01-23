const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ 写死：微信 OAuth → NewPay H5（高成功率）
const TARGET_URL =
  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa98fa9e9a4371ad4&redirect_uri=https%3A%2F%2Fprod-h5-new.newpay.la%2FwechatPay%2FinputPrice%3FshopId%3D1985258708900089857&response_type=code&scope=snsapi_base&state=shop1985258708900089857&connect_redirect=1#wechat_redirect";

// ✅ 只允许这个路径跳转支付
app.get("/wx.1", (req, res) => {
  return res.redirect(302, TARGET_URL);
});

// ❌ 其他任何路径：直接拒绝
app.get("*", (req, res) => {
  return res.status(403).send("Forbidden");
});

// 健康检查（可选）
app.get("/health", (req, res) => res.send("ok"));

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});