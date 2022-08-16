const isLogged = (req, res, next) => {
    req.session.user ? res.redirect('/') : next()
}
const isLoggedIn = (req, res, next) => {
    req.session.user ? next() : res.redirect('/login')
}

module.exports = { isLogged, isLoggedIn }