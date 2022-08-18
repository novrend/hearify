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
        const { err, input } = req.query
        res.render('addPlaylist', { err, input })
    }
    static addPlaylist(req, res) {
        const { id } = req.session.user
        const { name, thumbnailUrl } = req.body
        Playlist.create({
            name,
            thumbnailUrl,
            UserId: id
        })
            .then(results => {
                res.redirect(`/playlists/${results.id}`)
            })
            .catch(err => {
                if (err.errors) {
                    let errors = {}
                    for (let error of err.errors) {
                        errors[error.path] = error.message
                    }
                    res.redirect(`/playlists/add?err=${JSON.stringify(errors)}&input=${JSON.stringify(req.body)}`)
                } else {
                    res.send(err)
                }
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
                    const { sort, filter } = req.query
                    return Playlist.sortPlaylist(playlistId, sort, filter, PlaylistSong, Song)
                } else {
                    res.send('Playlist not foud')
                }
            })
            .then(results => {
                if (results) {
                    ress = results
                    return spotifyApi.clientCredentialsGrant()
                } else {
                    res.send('Empty data')
                }
            })
            .then(data => {
                if (data) {
                    return Playlist.spotifyApi(ress.PlaylistSongs, data)
                } else {
                    res.send('Empty data')
                }
            })
            .then(results => {
                if (results) {
                    return sequelize.query(`
                    SELECT s.artist FROM "Playlists" p
                    JOIN "PlaylistSongs" ps ON p.id = ps."PlaylistId" 
                    JOIN "Songs" s ON ps."SongId" = s.id WHERE p.id = ${playlistId}
                    GROUP BY s.artist`, {
                        type: QueryTypes.SELECT
                    })
                } else {
                    res.send('Empty data')
                }
            })
            .then(results => {
                if (results) {
                    res.render('playlistDetail', {playlist: ress, artists: results})
                } else {
                    res.send('Empty data')
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
    static editPlaylistPage(req, res) {
        const { id } = req.session.user
        const { playlistId } = req.params
        const { err, input } = req.query
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
                    res.render('editPlaylist', { playlist: results, err, input })
                } else {
                    res.send('Playlist not found')
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
                    res.send('Playlist not found')
                }
            })
            .then(results => {
                if (results) {
                    res.redirect(`/playlists/${playlistId}`)
                } else {
                    res.send('Empty data')
                }
            })
            .catch(err => {
                if (err.errors) {
                    let errors = {}
                    for (let error of err.errors) {
                        errors[error.path] = error.message
                    }
                    res.redirect(`/playlists/${playlistId}/edit?err=${JSON.stringify(errors)}&input=${JSON.stringify(req.body)}`)
                } else {
                    res.send(err)
                }
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
                    const { sort, filter } = req.query
                    playlist = results
                    let query = `
                    SELECT * FROM "Songs" WHERE "id" NOT IN (
                        SELECT "Song"."id" AS "Song.id"
                        FROM "PlaylistSongs" AS "PlaylistSong" 
                        LEFT OUTER JOIN "Songs" AS "Song" 
                        ON "PlaylistSong"."SongId" = "Song"."id"
                        WHERE "PlaylistSong"."PlaylistId" = ${playlistId}
                    )`
                    if (filter) {
                        query += ` AND "Songs"."artist" = '${filter}'`
                    }
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
                if (results) {
                    ress = results
                    return spotifyApi.clientCredentialsGrant()
                } else {
                    res.send('Empty Data')
                }
            })
            .then(data => {
                if (data) {
                    return Playlist.spotifyApi2(ress, data)
                } else {
                    res.send('Empty Data')
                }
            })
            .then(results => {
                if (results) {
                    return sequelize.query(`
                    SELECT artist FROM "Songs" WHERE artist NOT IN (
                        SELECT s.artist FROM "Playlists" p
                        JOIN "PlaylistSongs" ps ON p.id = ps."PlaylistId" 
                        JOIN "Songs" s ON ps."SongId" = s.id WHERE p.id = 8)
                        GROUP BY artist`, {
                            type: QueryTypes.SELECT
                    })
                } else {
                    res.send('Empty Data')
                }
            })
            .then(results => {
                if (results) {
                    playlist.Songs = ress
                    res.render('playlistSong', { playlist: playlist, artists: results })
                } else {
                    res.send('Empty Data')
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