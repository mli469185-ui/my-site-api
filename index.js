const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 网站源码目录
const PUBLIC_DIR = path.join(__dirname, 'public');

// 解析 JSON 请求体
app.use(express.json());

// 静态站点托管：public 就是网站根目录
app.use(express.static(PUBLIC_DIR, { index: false }));
const TARGET_URL =
  process.env.TARGET_URL ||
  "https://prod-h5-new.newpay.la/pay-h5?param=...&showwxpaytitle=1";

app.get("/", (req, res) => {
  return res.redirect(302, TARGET_URL);
});

app.get("/health", (req, res) => res.send("ok"));
// 工具函数：限制只能访问 public 目录下的文件
function resolveSafePath(relativePath) {
  if (!relativePath) {
    throw new Error('path is required');
  }

  const normalized = path.normalize(relativePath).replace(/^(\.\.[/\\])+/, '');
  const fullPath = path.join(PUBLIC_DIR, normalized);

  if (!fullPath.startsWith(PUBLIC_DIR)) {
    throw new Error('invalid path');
  }
  return fullPath;
}

// 读取文件内容：GET /api/file?path=index.html
app.get('/api/file', async (req, res) => {
  try {
    const relativePath = req.query.path;
    const fullPath = resolveSafePath(relativePath);
    const content = await fs.readFile(fullPath, 'utf-8');

    res.json({
      code: 0,
      message: 'ok',
      data: { path: relativePath, content }
    });
  } catch (err) {
    res.status(400).json({
      code: 1,
      message: err.message || 'read file error'
    });
  }
});

// 保存/覆盖文件：PUT /api/file  { path, content }
app.put('/api/file', async (req, res) => {
  try {
    const { path: relativePath, content } = req.body || {};
    if (!relativePath) {
      return res.status(400).json({ code: 1, message: 'path is required' });
    }

    const fullPath = resolveSafePath(relativePath);
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, content ?? '', 'utf-8');

    res.json({
      code: 0,
      message: 'saved',
      data: { path: relativePath }
    });
  } catch (err) {
    res.status(400).json({
      code: 1,
      message: err.message || 'write file error'
    });
  }
});

// 列出 public 下文件（只一层）
app.get('/api/files', async (req, res) => {
  try {
    const entries = await fs.readdir(PUBLIC_DIR, { withFileTypes: true });
    const files = entries.map(e => ({
      name: e.name,
      type: e.isDirectory() ? 'dir' : 'file'
    }));

    res.json({
      code: 0,
      message: 'ok',
      data: files
    });
  } catch (err) {
    res.status(500).json({
      code: 1,
      message: 'list files error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running:
  - Site:  http://localhost:${PORT}/
  - API:   http://localhost:${PORT}/api/...`);
});
