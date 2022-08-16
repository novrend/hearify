const router = require('express').Router();
const user = require('../controllers/user');
const songs = require('./songs');
const playlists = require('./playlists');
const playlistsong = require('./playlistsong');
const { isLogged, isLoggedIn } = require('../middlewares/auth');

router.get('/', isLoggedIn, user.home)
router.get('/login', isLogged, user.loginPage)
router.post('/login', isLogged, user.login)
router.get('/register', isLogged, user.registerPage)
router.post('/register', isLogged, user.register)
router.get('/logout', isLoggedIn, user.logout)

router.use('/songs', songs)
router.use('/playlists', playlists)
router.use('/playlistsong', playlistsong)

module.exports = router