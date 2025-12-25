const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ 写死你的 NewPay 链接（不需要环境变量，不会第二天丢）
const TARGET_URL =
  "https://prod-h5-new.newpay.la/pay-h5?param=eyJtY2hJZCI6MTk4NTI1ODcwODY1NjgyMDIyNSwicGF5TWV0aG9kIjoxLCJzaG9wTmFtZSI6Iuemj-azsOijhemlsOWfjiIsInNob3BJbWciOiJodHRwOi8vaW50ZXJuYXRpb25hbC1wcm9kLW5ld3BheS1wZXJtaXQub3NzLWFwLXNvdXRoZWFzdC0xLmFsaXl1bmNzLmNvbS9mZmJiOTM4Nzc4NzM0ZmU5YjBhYTU2OWRjMzRlNjY3MS5wbmc_RXhwaXJlcz0yMDgxMjUzODM0Jk9TU0FjY2Vzc0tleUlkPUxUQUk1dEg1VkZKNlpzbXdrcUo3bTl6eCZTaWduYXR1cmU9N2FYSHZuVDRiM21CY2RPVUZBam5tUmdLM3pZJTNEIiwiY3VycmVuY3kiOiJDTlkiLCJzaG9wSWQiOjE5OTY2NTg0MzcwMTM3MzMzNzcsImNob29zZUN1cnJlbmN5Ijp0cnVlfQ";

// ✅ 两个地址都跳转：/ 和 /wx/pay
app.get(["/", "/wx/pay"], (req, res) => {
  return res.redirect(302, TARGET_URL);
});

// 健康检查
app.get("/health", (req, res) => res.send("ok"));

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
