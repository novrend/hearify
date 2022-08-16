const { User } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

class Controller {
    static home(req, res) {
        const { user } = req.session
        res.render('home', { user })
    }
    static loginPage(req, res) {
        const { err } = req.query
        res.render('login', { err })
    }
    static login(req, res) {
        const { email, password } = req.body
        User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { username: email }
                ]
            }
        })
            .then(result => {
                if (result) {
                    if (bcrypt.compareSync(password, result.password)) {
                        req.session.user = result
                        res.redirect('/')
                    } else {
                        res.redirect('/login?err=Invalid email or password')
                    }
                } else {
                    res.redirect('/login?err=Invalid email or password')
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
    static registerPage(req, res) {
        const { err } = req.query
        res.render('register', { err })
    }
    static register(req, res) {
        const { email, username, password, password2 } = req.body
        User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { username: username }
                ]
            }
        })
            .then(result => {
                if (result) {
                    res.redirect('/register?err=Email or username is already taken')
                } else {
                    if (password !== password2) {
                        res.redirect('/register?err=The password confirmation does not match')
                    } else {
                        return User.create({
                            username,
                            email,
                            password,
                            role: "user"
                        })
                    }
                }
            })
            .then (result => {
                if (result) {
                    req.session.user = result
                    res.redirect('/')
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
    static logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/login')
        })
    }
}

module.exports = Controller