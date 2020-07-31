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

router.post('/login', redirectDash, function (req, res, next) {
    console.log("User: ", req.body.username);
    console.log("Psw: ", req.body.password)

    var connection = mysql.createConnection({
        host: '192.168.3.240',
        user: 'shopping_helper',
        password: 'qNqz3PKKZ',
        database: 'shopping_helper'
    });

    connection.connect(function (err) {
        if (err) {
            console.log("Connection error" + err);
            return res.json({
                "status": false,
                "message": err
            });
        }
    });

    connection.query("SELECT ID,Username,Password FROM users WHERE Username = ?", [
        req.body.username
    ], function (err, result) {
        if (err) {
            console.log("Query Error" + err);
            res.json({
                "status": false,
                "message": err
            });
        } else {
            if (result != null && result.length > 0 && (result[0].Password === crypto.createHash('sha256').update(req.body.password).digest('hex'))) {
                req.session.username = result[0].Username;
                req.session.userID = result[0].ID;
                console.log("Auth OK for user: " + result[0].Username);

                res.json({
                    "status": true,
                    "message": "Welcome " + result[0].Username
                });
            } else {
                console.log("Auth NOT OK for user: " + req.body.username + "\n" + result);
                res.json({
                    "status": false,
                    "message": "Wrong username or password"
                });
            }
        }
    });

    connection.end();
});


module.exports = router;
