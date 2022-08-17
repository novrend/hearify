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
    static addSongPage(req, res) {
        res.render('addSong')
    }
    static addSong(req, res) {
        const { title, artist } = req.body
        Song.create({
            title, artist
        })
            .then(results => {
                res.redirect('/songs')
            })
            .catch(err => {
                res.send(err)
            })
    }
    static editSongPage(req, res) {
        const { songId } = req.params
        Song.findOne({
            where: {
                id : {
                    [Op.eq] : songId
                }
            }
        })
            .then(results => {
                res.render('editSong', { song: results })
            })
            .catch(err => {
                res.send(err)
            })
    }
    static editSong(req, res) {
        const { songId } = req.params
        const { title, artist } = req.body
        Song.update({
            title, artist
        }, {
            where : {
                id : {
                    [Op.eq] : songId
                }
            }
        })
            .then(results => {
                res.redirect('/songs')
            })
            .catch(err => {
                res.send(err)
            })
    }
    static deleteSong(req, res) {
        const { songId } = req.params
        Song.destroy({
            where: {
                id : {
                    [Op.eq] : songId
                }
            }
        })
            .then(results => {
                res.redirect('/songs')
            })
            .catch(err => {
                res.send(err)
            })
    }
}

module.exports = Controller