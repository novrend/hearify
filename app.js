const express = require('express');
const router = require('./routes');
const session = require('express-session');

const app = express()
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: '!@##@! !@##@!',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        sameSite: true
    }
}))
app.use(express.static('public'))
app.use('/', router)

app.listen(PORT, () => {
    console.log('this app running on port', PORT)
})