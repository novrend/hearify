const router = require('express').Router()
const Song = require('../controllers/song');
const { isAdmin, isLoggedIn } = require('../middlewares/auth');

router.use(isLoggedIn)
router.get('/', Song.songsPage)
router.get('/add', Song.addSongPage)
router.post('/add', Song.addSong)

router.use(isAdmin)
router.get('/:songId/edit', Song.editSongPage)
router.post('/:songId/edit', Song.editSong)
router.get('/:songId/delete', Song.deleteSong)

module.exports = router