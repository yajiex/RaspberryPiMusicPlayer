const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const player = require('play-sound')(opts = {});
const musicAPI = require('music-api');

let audio = null;

const searchAndPlay = (name) => {
    musicAPI.searchSong('qq', {
        key: name,
        limit: 1,
        page: 1,
    }).then(res => {
        if (res.success === true) {
            const songId = res.songList[0].id;
            if (songId) {
                musicAPI.getSong('qq', {
                    id: songId,
                    raw: false,
                }).then(res => {
                    if (res.success === true) {
                        const url = res.url;
                        if (url) {
                            audio = player.play(url, (err) => {
                                if (err && !err.killed) {
                                    throw err;
                                }
                            });
                        }
                    }
                }).catch((err => console.log(err)));
            }
        }
    }).catch(err => console.log(err));
};

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

            if (audio) {
                audio.kill();
            }

            searchAndPlay(musicName);

            response.statusCode = 200;
            response.end();
        });
    }
}).listen(8080);