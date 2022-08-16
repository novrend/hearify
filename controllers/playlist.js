const { Song, Playlist, PlaylistSong } = require('../models')
const { Op } = require('sequelize');

class Controller {
    static playlistsPage(req, res) {
        const { id } = req.session.user
        Playlist.findAll({
            where: {
                UserId: {
                    [Op.eq] : id
                }
            }
        })
            .then(results => {
                res.render('playlists', { playlists: results })
            })
            .catch(err => {
                res.send(err)
            })
    }
    static addPlaylistPage(req, res) {
        res.render('addPlaylist')
    }
    static addPlaylist(req, res) {
        const { name, thumbnailUrl } = req.body
        const { id } = req.session.user
        console.log(id)
        Playlist.create({
            name,
            thumbnailUrl,
            UserId: id
        })
            .then(results => {
                res.redirect(`/playlists/${results.id}`)
            })
            .catch(err => {
                console.log(err)
                res.send(err)
            })
    }
    static playlistDetailPage(req, res) {
        const { playlistId } = req.params
        Playlist.findByPk(playlistId)
            .then(results => {
                res.render('playlistDetail', {playlist: results})
            })
            .catch(err => {
                res.send(err)
            })
    }
    static editPlaylistPage(req, res) {
        const { id } = req.session.user
        const { playlistId } = req.params
        const { name, thumbnailUrl } = req.body
        Playlist.findOne({
            where : {
                [Op.and]: [
                    { UserId: id },
                    { id: playlistId }
                  ]
            }
        })
            .then(results => {
                if (results) {
                    res.render('editPlaylist', { playlist: results })
                } else {
                    res.send('This is not your playlist')
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
    static editPlaylistSongPage(req, res) {
        // const { id } = req.session.user
        const id = 1
        const { playlistId } = req.params
        Playlist.findOne({
            where : {
                [Op.and]: [
                    { UserId: id },
                    { id: playlistId }
                  ]
            }
        })
            .then(results => {
                if (results) {
                    return Song.findAll({
                        include: [{
                            model: PlaylistSong,
                            as: 'PlaylistSong'
                        }],
                        where: {
                            '$PlaylistSong.PlaylistId$': {
                                [Op.or]: {
                                    [Op.ne]: 2,
                                    [Op.is]: null
                                }
                            }
                        }
                    })
                    // res.render('playlistSong', { playlist: results })
                } else {
                    res.send('This is not your playlist')
                }
            })
            .then(results => {
                if (results) {
                    res.send(results)
                }
            })
            .catch(err => {
                console.log(err)
                res.send(err)
            })
    }
    static editPlaylistSong(req, res) {
        const { id } = req.session.user
        const { playlistId, songId } = req.params
        const { song } = req.body
        Playlist.findOne({
            where : {
                [Op.and]: [
                    { UserId: id },
                    { id: playlistId }
                  ]
            }
        })
            .then(results => {
                if (results) {
                    return PlaylistSong.create({
                        PlaylistId: playlistId,
                        SongId: songId
                    })
                } else {
                    res.send('This is not your playlist')
                }
            })
            .then(results => {
                if(results) {
                    res.redirect(`/playlists/${playlistId}`)
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
}

module.exports = Controller