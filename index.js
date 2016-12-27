const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const player = require('play-sound')(opts = {});

http.createServer((request, response) => {
    request.on('error', (err) => {

    });

    response.on('error', (err) => {

    });

    if (request.method === 'GET' && request.url === '/') {
        fs.readFile('index.html', (err, data) => {
            response.writeHead(200, {
                'Content-Type': 'text/html',
                'Content-Length': data.length,
            });
            response.write(data);
            response.end();
        });
    } else if (request.method === 'POST') {
        let body = '';
        request.on('data', (data) => {
            body += data;
            if (body.length > 1e6) {
                request.connection.destroy();
            }
        });

        request.on('end', () => {
            const post = qs.parse(body);
            const musicName = post.name;
            console.log(musicName);

            player.play('example.mp', (err) => {
                if (err) {
                    throw err;
                }
            });

            response.statusCode = 200;
            response.end();
        });
    }
}).listen(8080);