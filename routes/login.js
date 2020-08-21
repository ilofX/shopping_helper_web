var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var crypto = require('crypto');

const redirectDash = (req, res, next) => {
    if (req.session.userID) {
        res.redirect('/dash');
    } else {
        next();
    }
}

router.get('/', redirectDash, function (req, res, next) {
    res.render('login', {title: 'Shopping Helper Login'});
});

module.exports = router;
