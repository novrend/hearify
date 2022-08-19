const { Song, Playlist, PlaylistSong, sequelize } = require('../models')
const { Op } = require('sequelize');
const { QueryTypes } = require('sequelize');

class Controller {
    static playlistsPage(req, res) {
        const { id } = req.session.user
        const { err } = req.query
        Playlist.findAll({
            where: {
                UserId: {
                    [Op.eq] : id
                }
            }
        })
            .then(results => {
                res.render('playlists', { playlists: results, err })
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
        const { id, role } = req.session.user
        const { playlistId } = req.params
        let query = {
            where : {
                id : {
                    [Op.eq] : playlistId
                }
            }
        }
        if (role !== 'admin') {
            query.where.UserId = {
                [Op.eq] : id
            }
        }
        let playlistData
        Playlist.findOne(query)
            .then(results => {
                if (results) {
                    const { sort, filter } = req.query
                    return Playlist.sortPlaylist(playlistId, sort, filter)
                } else {
                    res.send('Playlist not foud')
                }
            })
            .then(data => {
                if (data) {
                    playlistData = data
                    return Playlist.spotifyApi(playlistData.PlaylistSongs)
                } else {
                    res.send('Empty data')
                }
            })
            .then(results => {
                if (results) {
                    results.forEach((el,i) => {
                        playlistData.PlaylistSongs[i].Song.link = el.body.tracks.items[0].preview_url
                        playlistData.PlaylistSongs[i].Song.album = el.body.tracks.items[0].album.images[1].url
                    })
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
                    res.render('playlistDetail', {playlist: playlistData, artists: results})
                } else {
                    res.send('Empty data')
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
    static editPlaylistPage(req, res) {
        const { id, role } = req.session.user
        const { playlistId } = req.params
        const { err, input } = req.query
        let query = {
            where : {
                id : {
                    [Op.eq] : playlistId
                }
            }
        }
        if (role !== 'admin') {
            query.where.UserId = {
                [Op.eq] : id
            }
        }
        Playlist.findOne(query)
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
        const { id, role } = req.session.user
        const { playlistId } = req.params
        const { name, thumbnailUrl } = req.body
        let query = {
            where : {
                id : {
                    [Op.eq] : playlistId
                }
            }
        }
        if (role !== 'admin') {
            query.where.UserId = {
                [Op.eq] : id
            }
        }
        Playlist.findOne(query)
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
        const { id, role } = req.session.user
        const { playlistId } = req.params
        let query = {
            where : {
                id : {
                    [Op.eq] : playlistId
                }
            }
        }
        if (role !== 'admin') {
            query.where.UserId = {
                [Op.eq] : id
            }
        }
        let playlistData = {}
        Playlist.findOne(query)
            .then(results => {
                if (results) {
                    const { sort, filter } = req.query
                    playlistData = results
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
                    res.send('Playlist not found')
                }
            })
            .then(data => {
                if (data) {
                    playlistData.Songs = data
                    return Playlist.spotifyApi(playlistData.Songs)
                } else {
                    res.send('Empty Data')
                }
            })
            .then(results => {
                if (results) {
                    results.forEach((el,i) => {
                        playlistData.Songs[i].link = el.body.tracks.items[0].preview_url
                        playlistData.Songs[i].album = el.body.tracks.items[0].album.images[1].url
                    })
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
                    res.render('playlistSong', { playlist: playlistData, artists: results })
                } else {
                    res.send('Empty Data')
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
    static editPlaylistSong(req, res) {
        const { id, role } = req.session.user
        const { playlistId, songId } = req.params
        let query = {
            where : {
                id : {
                    [Op.eq] : playlistId
                }
            }
        }
        if (role !== 'admin') {
            query.where.UserId = {
                [Op.eq] : id
            }
        }
        Playlist.findOne(query)
            .then(results => {
                if (results) {
                    return PlaylistSong.findOne({
                        where: {
                            PlaylistId: playlistId,
                            SongId: songId
                        }
                    })
                } else {
                    res.send('Playlist not found')
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
        const { id, role } = req.session.user
        const { playlistId, songId } = req.params
        let query = {
            where : {
                id : {
                    [Op.eq] : playlistId
                }
            }
        }
        if (role !== 'admin') {
            query.where.UserId = {
                [Op.eq] : id
            }
        }
        Playlist.findOne(query)
            .then(results => {
                if (results) {
                    return PlaylistSong.destroy({
                        where: {
                            PlaylistId: {
                                [Op.eq] : playlistId
                            },
                            SongId: {
                                [Op.eq] : songId
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
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
    static allPlaylistsDetailPage(req, res) {
        const { err } = req.params
        Playlist.findAll()
            .then(results => {
                res.render('playlists', { playlists: results, err })
            })
            .catch(err => {
                res.send(err)
            })
    }
    static deletePlaylist(req, res) {
        const { id, role } = req.session.user
        const { playlistId } = req.params
        let deleted
        let query = {
            where : {
                id : {
                    [Op.eq] : playlistId
                }
            }
        }
        if (role !== 'admin') {
            query.where.UserId = {
                [Op.eq] : id
            }
        }
        Playlist.findOne(query)
            .then(results => {
                deleted = results.name
                if (results) {
                    return Playlist.destroy({
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
                    res.redirect(`/playlists?err=Playlist ${deleted} has been deleted`)
                } else {
                    res.send('Empty data')
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
}

module.exports = Controller