const { Song, Playlist, PlaylistSong } = require('../models')
const { Op } = require('sequelize');
const SpotifyWebApi = require('spotify-web-api-node');
let spotifyApi = new SpotifyWebApi({
    clientId: '54ad5ca56d494d1ba439c7a366e3f09a',
    clientSecret: 'f916b7c948fe4a48a71b39d2853c8562',
    redirectUri: 'http://www.michaelthelin.se/test-callback'
});

class Controller {
    static songsPage(req, res) {
        // const { user }  = req.session
        const user = {role : 'admin'}
        const { sort } = req.query
        let ress
        Song.sortSongs(sort, Song)
            .then(results => {
                ress = results
                return spotifyApi.clientCredentialsGrant()
            })
            .then(data => {
                return Playlist.spotifyApi2(ress, data)
            })
            .then(results => {
                res.render('songs', {songs: ress, user})
            })
            .catch(err => {
                res.send(err)
            })
    }
}

module.exports = Controller