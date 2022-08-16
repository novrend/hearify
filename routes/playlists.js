const router = require('express').Router()
const Playlist = require('../controllers/playlist');
const { isLogged, isLoggedIn } = require('../middlewares/auth');

router.get('/', isLoggedIn, Playlist.playlistsPage)
router.get('/add', isLoggedIn, Playlist.addPlaylistPage)
router.post('/add', isLoggedIn, Playlist.addPlaylist)
router.get('/:playlistId', isLoggedIn, Playlist.playlistDetailPage)
router.get('/:playlistId/edit', isLoggedIn, Playlist.editPlaylistPage)
router.post('/:playlistId/edit', isLoggedIn)

router.get('/:playlistId/edit/song', Playlist.editPlaylistSongPage)
router.get('/:playlistId/edit/song/:songId', Playlist.editPlaylistSong)

router.get('/:playlistId/delete', isLoggedIn)
router.get('/:playlistId/delete/:songId', isLoggedIn)

module.exports = router