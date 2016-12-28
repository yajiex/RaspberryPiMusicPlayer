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

const stop = () => {
    if (audio) {
        audio.kill();
    }
};

module.exports = {
    play: searchAndPlay,
    stop: stop,
};