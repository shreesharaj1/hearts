const express = require('express')
const router = express.Router()
const User = require('../database/models/user')
const passport = require('../passport')

router.options('/', (req,res) => {
    //console.log('user signup');
    res.set('Access-Control-Allow-Origin', '*');
    res.json({});
});

router.post('/', (req, res) => {
    console.log('user signup--');
    res.set('Access-Control-Allow-Origin', '*');
    const { username, email, password } = req.body
    // ADD VALIDATION
    User.findOne({ email }, (err, user) => {
        if (err) {
            console.log('User.js post error: ', err)
        } else if (user) {
            res.json({
                error: `Sorry, already a user with the email: ${email}`
            })
        }
        else {
            const newUser = new User({
                username,
                email,
                password
            })
            newUser.save((err, savedUser) => {
                if (err) return res.json(err)
                res.json(savedUser)
            })
        }
    })
})

router.post(
    '/login',
    function (req, res, next) {
        console.log('routes/user.js, login, req.body: ');
        console.log(req.body)
        next()
    },
    passport.authenticate('local'),
    (req, res) => {
        console.log('logged in', req.user);
        res.send({user:req.user});
    }
)

router.get('/', (req, res, next) => {
    console.log('===== user!!======')
    console.log(req.user)
    if (req.user) {
        res.json({ user: req.user })
    } else {
        res.json({ user: null })
    }
})

router.get('/logout', (req, res) => {
    if (req.user) {
        req.logout()
        res.send({ msg: 'logging out' })
    } else {
        res.send({ msg: 'no user to log out' })
    }
})

module.exports = router