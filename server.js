const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

let PORT = parseInt(process.env.PORT, 10) || 5500;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json'
};

function getNetworkIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function startServer(port) {
  const server = http.createServer((req, res) => {
    // Normalize URL path
    let filePath = req.url === '/' ? './index.html' : '.' + req.url;
    filePath = filePath.split('?')[0].split('#')[0];

    const extname = path.extname(filePath);
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          // Fallback to index.html for 404
          fs.readFile('./index.html', (err, indexContent) => {
            if (err) {
              res.writeHead(404, { 'Content-Type': 'text/plain' });
              res.end('404 Not Found');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(indexContent, 'utf-8');
            }
          });
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end(`Server Error: ${error.code}`);
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(port, '0.0.0.0', () => {
    const networkIp = getNetworkIp();
    console.log(`\nServer successfully running!`);
    console.log(`- Local:   http://localhost:${port}/`);
    console.log(`- IP:      http://127.0.0.1:${port}/`);
    console.log(`- Network: http://${networkIp}:${port}/\n`);
  });
}

startServer(PORT);
