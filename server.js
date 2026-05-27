const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const PORT = 4321;

http.createServer((req, res) => {
  let filePath = path.join(DIST, req.url === '/' ? '/index.html' : req.url);
  if (!filePath.startsWith(DIST)) { res.writeHead(403); return res.end(); }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Fallback to index.html for SPA routing
      fs.readFile(path.join(DIST, '404.html'), (err2, data2) => {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(data2 || 'Not Found');
      });
      return;
    }
    const ext = path.extname(filePath);
    const mime = {
      '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
      '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml', '.xml': 'application/xml', '.ico': 'image/x-icon',
      '.woff2': 'font/woff2', '.woff': 'font/woff', '.webp': 'image/webp',
      '.avif': 'image/avif', '.txt': 'text/plain', '.mjs': 'application/javascript',
    }[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Server: http://localhost:${PORT}/individual-blog/`));
