const { Song, Playlist, PlaylistSong } = require('../models')
const { Op } = require('sequelize');
let spotifyApi = require('../helpers/spotifyApi');

class Controller {
    static songsPage(req, res) {
        const { user }  = req.session
        const { sort, filter } = req.query
        let ress
        Song.sortSongs(sort, filter)
            .then(data => {
                if (data) {
                    ress = data
                    return Playlist.spotifyApi(ress)
                } else {
                    res.send('Empty data')
                }
            })
            .then(results => {
                if (results) {
                    results.forEach((el,i) => {
                        ress[i].link = el.body.tracks.items[0].preview_url
                        ress[i].album = el.body.tracks.items[0].album.images[1].url
                    })
                    return Song.findAll({ attributes: ['artist'], group: "artist"})
                } else {
                    res.send('Empty data')
                }
            })
            .then(results => {
                if (results) {
                    res.render('songs', {songs: ress, user, artists: results})
                } else {
                    res.send('Empty data')
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
    static addSongPage(req, res) {
        const { err, input } = req.query
        res.render('addSong', { err, input })
    }
    static addSong(req, res) {
        const { title, artist } = req.body
        spotifyApi.searchTracks(`track:${title} ${artist}`)
            .then(data => {
                if (typeof data.body.tracks.items[0] == 'undefined') {
                    let errors = {
                        title: 'Title song not found'
                    }
                    res.redirect(`/songs/add?err=${JSON.stringify(errors)}&input=${JSON.stringify(req.body)}`)
                } else {
                    return Song.create({
                        title, artist
                    })
                }
            })
            .then(results => {
                if (results) {
                    res.redirect('/songs')
                }
            })
            .catch(err => {
                if (err.errors) {
                    let errors = {}
                    for (let error of err.errors) {
                        errors[error.path] = error.message
                    }
                    res.redirect(`/songs/add?err=${JSON.stringify(errors)}&input=${JSON.stringify(req.body)}`)
                } else {
                    res.send(err)
                }
            })
    }
    static editSongPage(req, res) {
        const { err, input } = req.query
        const { songId } = req.params
        Song.findOne({
            where: {
                id : {
                    [Op.eq] : songId
                }
            }
        })
            .then(results => {
                res.render('editSong', { song: results, err, input })
            })
            .catch(err => {
                res.send(err)
            })
    }
    static editSong(req, res) {
        const { songId } = req.params
        const { title, artist } = req.body
        spotifyApi.searchTracks(`track:${title} ${artist}`)
            .then(data => {
                if (typeof data.body.tracks.items[0] == 'undefined') {
                    let errors = {
                        title: 'Title song not found'
                    }
                    res.redirect(`/songs/${songId}/edit?err=${JSON.stringify(errors)}&input=${JSON.stringify(req.body)}`)
                } else {
                    return Song.update({
                        title, artist
                    }, {
                        where : {
                            id : {
                                [Op.eq] : songId
                            }
                        }
                    })
                }
            })
            .then(results => {
                if (results) {
                    res.redirect('/songs')
                }
            })
            .catch(err => {
                if (err.errors) {
                    let errors = {}
                    for (let error of err.errors) {
                        errors[error.path] = error.message
                    }
                    res.redirect(`/songs/${songId}/edit?err=${JSON.stringify(errors)}&input=${JSON.stringify(req.body)}`)
                } else {
                    res.send(err)
                }
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