/**
 * Butterfly 主题完整检测脚本
 * 构建 + 启动服务 + 验证所有核心页面 + 检测关键 HTML 结构
 * 用法: node butterfly-check.mjs
 */

import { execSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 19877;
const BASE = '/individual-blog';

const PAGES = [
  { url: '/individual-blog/', name: '首页' },
  { url: '/individual-blog/posts/hello-world/', name: '文章页' },
  { url: '/individual-blog/category/%E7%AE%97%E6%B3%95/', name: '分类页' },
  { url: '/individual-blog/archive/', name: '归档页' },
  { url: '/individual-blog/about/', name: '关于页' },
  { url: '/individual-blog/rss.xml', name: 'RSS' },
];

const STRUCTURE_CHECKS = [
  { pattern: 'butterfly', name: 'Butterfly CSS 类' },
  { pattern: 'page-header', name: '页面头部' },
  { pattern: 'site-title', name: '网站标题' },
  { pattern: 'scroll-down', name: '滚动箭头' },
  { pattern: 'recent-post-item', name: '文章卡片' },
  { pattern: 'article-title', name: '文章标题' },
  { pattern: 'article-meta-wrap', name: '文章元信息' },
  { pattern: 'aside-content', name: '侧边栏' },
  { pattern: 'card-widget', name: '侧边栏卡片' },
  { pattern: 'card-info', name: '作者信息' },
  { pattern: 'site-data', name: '网站数据' },
  { pattern: 'footer', name: '页脚' },
  { pattern: 'font-awesome', name: 'Font Awesome 图标' },
];

async function main() {
  console.log('='.repeat(50));
  console.log('  Butterfly 主题完整检测');
  console.log('='.repeat(50));

  // Step 1: Build
  console.log('\n[1/4] 构建项目...');
  try {
    execSync('npx astro build', { cwd: __dirname, stdio: 'pipe' });
    console.log('  ✓ 构建成功\n');
  } catch (e) {
    console.error('  ✗ 构建失败:', e.stderr?.toString().slice(0, 200));
    process.exit(1);
  }

  // Step 2: Start server
  console.log('[2/4] 启动测试服务器...');
  const dist = path.join(__dirname, 'dist');

  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.replace(BASE, '') || '/');
    let fp = path.join(dist, url === '/' ? '/index.html' : url);
    const ext = path.extname(fp);
    if (!ext && fs.existsSync(fp) && fs.statSync(fp).isDirectory()) {
      fp = path.join(fp, 'index.html');
    }
    const normPath = fp.replace(/\\/g, '/');
    const normDist = dist.replace(/\\/g, '/');
    if (!normPath.startsWith(normDist)) { res.writeHead(403); return res.end(); }
    fs.readFile(fp, (err, data) => {
      if (err) { res.writeHead(404); return res.end('Not Found'); }
      const mime = {
        '.html': 'text/html;charset=utf-8', '.css': 'text/css',
        '.js': 'application/javascript', '.xml': 'application/xml',
        '.png': 'image/png', '.svg': 'image/svg+xml',
        '.webp': 'image/webp', '.ico': 'image/x-icon',
      }[path.extname(fp)] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      res.end(data);
    });
  });

  await new Promise(r => server.listen(PORT, r));
  console.log('  ✓ 服务器运行在 http://localhost:' + PORT + BASE + '/\n');

  // Step 3: Test page responses
  console.log('[3/4] 页面响应测试...');
  let allOk = true;
  let htmlCache = {};
  for (const page of PAGES) {
    try {
      const res = await new Promise((resolve, reject) => {
        http.get('http://localhost:' + PORT + page.url, resolve);
        setTimeout(() => reject(new Error('超时')), 5000);
      });
      const status = res.statusCode === 200 ? '✓' : '✗';
      console.log(`  ${status} ${page.name} (${page.url}) → ${res.statusCode}`);
      if (res.statusCode !== 200) allOk = false;
      let body = '';
      for await (const chunk of res) body += chunk;
      htmlCache[page.url] = body;
    } catch (e) {
      console.log(`  ✗ ${page.name} → ${e.message}`);
      allOk = false;
    }
  }

  // Step 4: Check HTML structure on homepage
  console.log('\n[4/4] HTML 结构检测 (首页)...');
  const html = htmlCache['/individual-blog/'] || '';
  if (html) {
    for (const check of STRUCTURE_CHECKS) {
      const found = html.includes(check.pattern);
      console.log(`  ${found ? '✓' : '✗'} ${check.name}`);
      if (!found) allOk = false;
    }
  }

  // Also check post page has article-container
  const postHtml = htmlCache['/individual-blog/posts/hello-world/'] || '';
  if (postHtml) {
    const hasArticle = postHtml.includes('article-container');
    console.log(`  ${hasArticle ? '✓' : '✗'} 文章内容容器`);
    if (!hasArticle) allOk = false;
  }

  server.close();

  console.log('\n' + '='.repeat(50));
  if (allOk) {
    console.log('  ✓ 全部通过！可以部署到服务器');
    console.log('  dist/ 目录已就绪');
    process.exit(0);
  } else {
    console.log('  ✗ 存在错误，请检查后重试');
    process.exit(1);
  }
}

main();
