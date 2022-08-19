const router = require('express').Router();
const user = require('../controllers/user');
const songs = require('./songs');
const playlists = require('./playlists');
const { isNotLoggedIn, isLoggedIn } = require('../middlewares/auth');

router.use('/songs', songs)
router.use('/playlists', playlists)

router.get('/', isLoggedIn, user.home)
router.get('/logout', isLoggedIn, user.logout)

router.use(isNotLoggedIn)
router.get('/login', user.loginPage)
router.post('/login', user.login)
router.get('/register', user.registerPage)
router.post('/register', user.register)


module.exports = router