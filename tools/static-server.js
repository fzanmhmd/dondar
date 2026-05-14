const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 3131);
const mime = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg'
};

http.createServer((request, response) => {
    let urlPath = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    if (urlPath === '/') urlPath = '/index.html';

    const filePath = path.join(root, urlPath.replace(/^\/+/, ''));
    if (!filePath.startsWith(root)) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (error, data) => {
        if (error) {
            response.writeHead(404);
            response.end('Not found');
            return;
        }

        response.writeHead(200, {
            'content-type': mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
        });
        response.end(data);
    });
}).listen(port, '127.0.0.1', () => {
    console.log(`DonDar server running at http://127.0.0.1:${port}`);
});
