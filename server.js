const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const host = '127.0.0.1';
const port = Number(process.env.PORT) || 3000;
const pagePath = path.join(__dirname, 'index.html');

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method Not Allowed');
    return;
  }

  const pathname = new URL(req.url, `http://${req.headers.host || `${host}:${port}`}`).pathname;
  if (pathname !== '/' && pathname !== '/index.html') {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
    return;
  }

  fs.readFile(pagePath, (error, html) => {
    if (error) {
      console.error('페이지를 읽을 수 없습니다:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Internal Server Error');
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': html.length,
      'Cache-Control': 'no-cache',
    });
    res.end(req.method === 'HEAD' ? undefined : html);
  });
});

server.listen(port, host, () => {
  console.log(`프로필 사이트가 http://${host}:${port} 에서 실행 중입니다.`);
});

server.on('error', (error) => {
  console.error('서버 실행 오류:', error.message);
  process.exitCode = 1;
});
