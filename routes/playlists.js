const router = require('express').Router()
const Playlist = require('../controllers/playlist');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');

router.get('/', isLoggedIn, Playlist.playlistsPage)
router.get('/add', isLoggedIn, Playlist.addPlaylistPage)
router.post('/add', isLoggedIn, Playlist.addPlaylist)
router.get('/all', isLoggedIn, isAdmin, Playlist.allPlaylistsDetailPage)
router.get('/:playlistId', Playlist.playlistDetailPage)
router.get('/:playlistId/edit', isLoggedIn, Playlist.editPlaylistPage)
router.post('/:playlistId/edit', isLoggedIn, Playlist.editPlaylist)
router.get('/:playlistId/edit/song', isLoggedIn, Playlist.editPlaylistSongPage)
router.get('/:playlistId/edit/song/:songId', isLoggedIn, Playlist.editPlaylistSong)
router.get('/:playlistId/delete/:songId', isLoggedIn, Playlist.deleteSongFromPlaylist)

module.exports = router