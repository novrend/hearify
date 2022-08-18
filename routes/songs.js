const router = require('express').Router()
const Song = require('../controllers/song');
const { isAdmin, isLoggedIn } = require('../middlewares/auth');

router.get('/', isLoggedIn, Song.songsPage)
router.get('/add', isLoggedIn, Song.addSongPage)
router.post('/add', isLoggedIn, Song.addSong)
router.get('/:songId/edit', isLoggedIn, isAdmin, Song.editSongPage)
router.post('/:songId/edit', isLoggedIn, isAdmin, Song.editSong)
router.get('/:songId/delete', isLoggedIn, isAdmin, Song.deleteSong)

module.exports = router