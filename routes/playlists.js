const router = require('express').Router()
const Playlist = require('../controllers/playlist');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');

router.use(isLoggedIn)
router.get('/', Playlist.playlistsPage)
router.get('/add', Playlist.addPlaylistPage)
router.post('/add', Playlist.addPlaylist)
router.get('/all', isAdmin, Playlist.allPlaylistsDetailPage)
router.get('/:playlistId', Playlist.playlistDetailPage)
router.get('/:playlistId/edit', Playlist.editPlaylistPage)
router.post('/:playlistId/edit', Playlist.editPlaylist)
router.get('/:playlistId/edit/song', Playlist.editPlaylistSongPage)
router.get('/:playlistId/edit/song/:songId', Playlist.editPlaylistSong)
router.get('/:playlistId/delete/:songId', Playlist.deleteSongFromPlaylist)

module.exports = router