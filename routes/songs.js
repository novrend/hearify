const router = require('express').Router()
const Song = require('../controllers/song');
const { isAdmin, isLoggedIn } = require('../middlewares/auth');

router.get('/', isLoggedIn, Song.songsPage)
router.get('/add', isLoggedIn, isAdmin, Song.addSongPage)
router.post('/add', isLoggedIn, isAdmin, Song.addSong)
router.get('/:songId/edit', Song.editSongPage)
router.post('/:songId/edit', Song.editSong)
router.get('/:songId/delete', Song.deleteSong)

module.exports = router