const { Song, Playlist, PlaylistSong, sequelize } = require('../models')
const { Op } = require('sequelize');
const { QueryTypes } = require('sequelize');
const SpotifyWebApi = require('spotify-web-api-node');
let spotifyApi = new SpotifyWebApi({
    clientId: '54ad5ca56d494d1ba439c7a366e3f09a',
    clientSecret: 'f916b7c948fe4a48a71b39d2853c8562',
    redirectUri: 'http://www.michaelthelin.se/test-callback'
});

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
        Playlist.create({
            name,
            thumbnailUrl,
            UserId: id
        })
            .then(results => {
                res.redirect(`/playlists/${results.id}`)
            })
            .catch(err => {
                res.send(err)
            })
    }
    static playlistDetailPage(req, res) {
        const { id } = req.session.user
        const { playlistId } = req.params
        let ress
        Playlist.findOne({
            where : {
                [Op.and]: [
                    {
                        UserId : {
                            [Op.eq] : id
                        },
                    },
                    {
                        id : {
                            [Op.eq] : playlistId
                        }
                    }
                ]
            }
        })
            .then(results => {
                if (results) {
                    const { sort } = req.query
                    return Playlist.sortPlaylist(playlistId, sort, PlaylistSong, Song)
                } else {
                    res.send('This is not your playlist')
                }
            })
            .then(results => {
                ress = results
                return spotifyApi.clientCredentialsGrant()
            })
            .then(data => {
                return Playlist.spotifyApi(ress.PlaylistSongs, data)
            })
            .then(results => {
                if (results) {
                    res.render('playlistDetail', {playlist: ress})
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
    static editPlaylistPage(req, res) {
        const { id } = req.session.user
        const { playlistId } = req.params
        Playlist.findOne({
            where : {
                [Op.and]: [
                    {
                        UserId : {
                            [Op.eq] : id
                        },
                    },
                    {
                        id : {
                            [Op.eq] : playlistId
                        }
                    }
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
    static editPlaylist(req, res) {
        const { id } = req.session.user
        const { playlistId } = req.params
        const { name, thumbnailUrl } = req.body
        Playlist.findOne({
            where : {
                [Op.and]: [
                    {
                        UserId : {
                            [Op.eq] : id
                        },
                    },
                    {
                        id : {
                            [Op.eq] : playlistId
                        }
                    }
                ]
            }
        })
            .then(results => {
                if (results) {
                    return Playlist.update({
                        name, thumbnailUrl
                    }, {
                        where: {
                            id : {
                                [Op.eq] : playlistId
                            }
                        }
                    })
                } else {
                    res.send('This is not your playlist')
                }
            })
            .then(results => {
                if (results) {
                    res.redirect(`/playlists/${playlistId}`)
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
    static editPlaylistSongPage(req, res) {
        const { id } = req.session.user
        const { playlistId } = req.params
        let playlist = {}
        let ress
        Playlist.findOne({
            where : {
                [Op.and]: [
                    {
                        UserId : {
                            [Op.eq] : id
                        },
                    },
                    {
                        id : {
                            [Op.eq] : playlistId
                        }
                    }
                ]
            }
        })
            .then(results => {
                if (results) {
                    const { sort } = req.query
                    playlist = results
                    let query = `
                    SELECT * FROM "Songs" WHERE "id" NOT IN (
                        SELECT "Song"."id" AS "Song.id"
                        FROM "PlaylistSongs" AS "PlaylistSong" 
                        LEFT OUTER JOIN "Songs" AS "Song" 
                        ON "PlaylistSong"."SongId" = "Song"."id"
                        WHERE "PlaylistSong"."PlaylistId" = ${playlistId}
                    )`
                    if (sort) {
                        if (sort === 'artist') query += ` ORDER BY "Songs"."artist" ASC`
                        else if (sort === 'artistdesc') query += ` ORDER BY "Songs"."artist" DESC`
                        else if (sort === 'title') query += ` ORDER BY "Songs"."title" ASC`
                        else if (sort === 'titledesc') query += ` ORDER BY "Songs"."title" DESC`
                    }
                    return sequelize.query(query, {
                        type: QueryTypes.SELECT
                    })
                } else {
                    res.send('This is not your playlist')
                }
            })
            .then(results => {
                ress = results
                return spotifyApi.clientCredentialsGrant()
            })
            .then(data => {
                return Playlist.spotifyApi2(ress, data)
            })
            .then(results => {
                if (results) {
                    playlist.Songs = ress
                    res.render('playlistSong', { playlist: playlist })
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
    static editPlaylistSong(req, res) {
        const { id } = req.session.user
        const { playlistId, songId } = req.params
        Playlist.findOne({
            where : {
                [Op.and]: [
                    {
                        UserId : {
                            [Op.eq] : id
                        },
                    },
                    {
                        id : {
                            [Op.eq] : playlistId
                        }
                    }
                ]
            }
        })
            .then(results => {
                if (results) {
                    return PlaylistSong.findOne({
                        PlaylistId: playlistId,
                        SongId: songId
                    })
                } else {
                    res.send('This is not your playlist')
                }
            })
            .then(results => {
                if (results) {
                    res.send('You already added this song')
                } else {
                    return PlaylistSong.create({
                        PlaylistId: playlistId,
                        SongId: songId
                    })
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
    static deleteSongFromPlaylist(req, res) {
        const { id } = req.session.user
        const { playlistId, songId } = req.params
        Playlist.findOne({
            where : {
                [Op.and]: [
                    {
                        UserId : {
                            [Op.eq] : id
                        },
                    },
                    {
                        id : {
                            [Op.eq] : playlistId
                        }
                    }
                ]
            }
        })
            .then(results => {
                if (results) {
                    return PlaylistSong.destroy({
                        where: {
                            [Op.and] : [
                                {
                                    PlaylistId: {
                                        [Op.eq] : playlistId
                                    }
                                },
                                {
                                    SongId: {
                                        [Op.eq] : songId
                                    }
                                }
                            ]
                        }
                    })
                } else {
                    res.send('This is not your playlist')
                }
            })
            .then(results => {
                if (results) {
                    res.redirect(`/playlists/${playlistId}`)
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
    static allPlaylistsDetailPage(req, res) {
        Playlist.findAll()
            .then(results => {
                res.render('playlists', { playlists: results })
            })
            .catch(err => {
                res.send(err)
            })
    }
}

module.exports = Controller