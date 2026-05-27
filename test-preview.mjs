/**
 * 本地预览测试脚本
 * 构建项目 → 启动 HTTP 服务 → 验证响应状态
 *
 * 用法: node test-preview.mjs
 */

import { execSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 19876;
const BASE = '/individual-blog';
const PAGES = [
  '/individual-blog/',
  '/individual-blog/posts/hello-world/',
  '/individual-blog/category/%E7%AE%97%E6%B3%95/',
  '/individual-blog/archive/',
  '/individual-blog/rss.xml',
];

async function main() {
  console.log('=== Blog Butterfly 预览测试 ===\n');

  // Step 1: Build
  console.log('[1/3] 构建项目...');
  try {
    execSync('npx astro build', {
      cwd: __dirname,
      stdio: 'pipe',
      env: { ...process.env },
    });
    console.log('  构建成功 ✓\n');
  } catch (e) {
    console.error('  构建失败:', e.stderr?.toString() || e.message);
    process.exit(1);
  }

  // Step 2: Start server and test
  console.log('[2/3] 启动测试服务器...');
  const dist = path.join(__dirname, 'dist');
  if (!fs.existsSync(path.join(dist, 'index.html'))) {
    console.error('  dist/index.html 不存在！');
    process.exit(1);
  }

  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.replace(BASE, '') || '/');
    let filePath = path.join(dist, url === '/' ? '/index.html' : url);
    // 如果是目录（结尾无扩展名），尝试 index.html
    const ext = path.extname(filePath);
    if (!ext && fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    // 标准化路径分隔符（Windows 兼容）
    const normalizedPath = filePath.replace(/\\/g, '/');
    const normalizedDist = dist.replace(/\\/g, '/');
    if (!normalizedPath.startsWith(normalizedDist)) { res.writeHead(403); return res.end('Forbidden'); }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        fs.readFile(path.join(dist, '404.html'), (_, d2) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(d2 || 'Not Found');
        });
        return;
      }
      const ext2 = path.extname(filePath);
      const mime = {
        '.html': 'text/html;charset=utf-8', '.css': 'text/css',
        '.js': 'application/javascript', '.xml': 'application/xml',
        '.json': 'application/json', '.png': 'image/png',
        '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon', '.webp': 'image/webp',
      }[ext2] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      res.end(data);
    });
  });

  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`  服务器: http://localhost:${PORT}${BASE}/\n`);

  // Step 3: Test pages
  console.log('[3/3] 验证页面响应...');
  let allOk = true;
  for (const page of PAGES) {
    try {
      const res = await new Promise((resolve, reject) => {
        http.get(`http://localhost:${PORT}${page}`, resolve);
        setTimeout(() => reject(new Error('timeout')), 5000);
      });
      const ok = res.statusCode === 200;
      console.log(`  ${ok ? '✓' : '✗'} ${page} → ${res.statusCode}`);
      if (!ok) allOk = false;
      res.resume();
    } catch (e) {
      console.log(`  ✗ ${page} → ${e.message}`);
      allOk = false;
    }
  }

  server.close();
  console.log(`\n${allOk ? '✓ 全部通过！可以部署。' : '✗ 存在错误，请检查。'}`);
  process.exit(allOk ? 0 : 1);
}

main();
