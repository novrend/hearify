const router = require('express').Router()
const Song = require('../controllers/song');
const { isLogged, isLoggedIn } = require('../middlewares/auth');

// router.get('/')
// router.get('/add')
// router.post('/add')
// router.get('/:songId/edit')
// router.post('/:songId/edit')
// router.get('/:songId/delete')

module.exports = router