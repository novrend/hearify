const isLogged = (req, res, next) => {
    req.session.user ? res.redirect('/') : next()
}
const isLoggedIn = (req, res, next) => {
    req.session.user ? next() : res.redirect('/login')
}
const isAdmin = (req, res, next) => {
    req.session.user.role === "admin" ? next() : res.redirect('/')
}

module.exports = { isLogged, isLoggedIn, isAdmin }