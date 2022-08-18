const { User } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

class Controller {
    static home(req, res) {
        const { id } = req.session.user
        User.findOne({
            where: {
                id : {
                    [Op.eq] : id
                }
            }
        })
            .then(results => {
                res.render('home', { user: results })
            })
            .catch(err => {
                res.send(err)
            })
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
                        let err = {
                            email: "Invalid email or password"
                        }
                        res.redirect(`/login?err=${JSON.stringify(err)}`)
                    }
                } else {
                    let err = {
                        email: "Invalid email or password"
                    }
                    res.redirect(`/login?err=${JSON.stringify(err)}`)
                }
            })
            .catch(err => {
                if (err.errors) {
                    let errors = {}
                    for (let error of err.errors) {
                        errors[error.path] = error.message
                    }
                    res.redirect(`/login?err=${JSON.stringify(errors)}`)
                } else {
                    res.send(err)
                }
            })
    }
    static registerPage(req, res) {
        const { err, input } = req.query
        res.render('register', { err, input })
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
                    let err = {
                        email: "Email or username is already taken"
                    }
                    res.redirect(`/register?err=${JSON.stringify(err)}`)
                } else {
                    if (password !== password2) {
                        let err = {
                            password: "The password confirmation does not match"
                        }
                        res.redirect(`/register?err=${JSON.stringify(err)}`)
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
                } else {
                    res.redirect('/login')
                }
            })
            .catch(err => {
                if (err.errors) {
                    let errors = {}
                    for (let error of err.errors) {
                        errors[error.path] = error.message
                    }
                    res.redirect(`/register?err=${JSON.stringify(errors)}&input=${JSON.stringify({email, username})}`)
                } else {
                    res.send(err)
                }
            })
    }
    static logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/login')
        })
    }
}

module.exports = Controller