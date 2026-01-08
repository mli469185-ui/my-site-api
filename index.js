const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ 写死你的 NewPay 链接（不需要环境变量，不会第二天丢）
const TARGET_URL =
  "https://prod-h5-new.newpay.la/pay-h5?param=eyJtY2hJZCI6MTk4NTI1ODcwODY1NjgyMDIyNSwicGF5TWV0aG9kIjoxLCJzaG9wTmFtZSI6Ikdsb2JlVmlzdGEgVHJhZGluZyBDb28iLCJzaG9wSW1nIjoiaHR0cDovL2ludGVybmF0aW9uYWwtcHJvZC1uZXdwYXktcGVybWl0Lm9zcy1hcC1zb3V0aGVhc3QtMS5hbGl5dW5jcy5jb20vZDE1NzgwZmIxMzgzNDc3ZmIxZjg5MWI5ZTZhNmUyYTYucG5nP0V4cGlyZXM9MjA4MzIyMTcyNCZPU1NBY2Nlc3NLZXlJZD1MVEFJNXRINVZGSjZac213a3FKN205engmU2lnbmF0dXJlPTZMc0JOT0FyUUhZQlhQTWJlNHc4VlpWcyUyQkVBJTNEIiwiY3VycmVuY3kiOiJDTlkiLCJzaG9wSWQiOjE5ODgyNTUwMjY2MjY5OTgyNzMsImNob29zZUN1cnJlbmN5IjpmYWxzZX0";

// ✅ 两个地址都跳转：/ 和 /wx/pay
app.get(["/", "/wx/pay"], (req, res) => {
  return res.redirect(302, TARGET_URL);
});

// 健康检查
app.get("/health", (req, res) => res.send("ok"));

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
