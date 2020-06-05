var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var crypto = require('crypto');


router.get('/', function (req, res, next) {
    res.render('login', {title: 'Shopping Helper Login'});
});

router.post('/login_api', function (req, res, next) {
    console.log("User: ", req.body.username);
    console.log("Psw: ", req.body.password)

    var connection = mysql.createConnection({
        host: '192.168.3.240',
        user: 'shopping_helper',
        password: 'qNqz3PKKZ',
        database: 'shopping_helper'
    });
    connection.connect();

    connection.query("SELECT ID,Username,Password FROM Users WHERE Username = ?", [
        req.body.username
    ], function (err, result) {
        if (err) res.json({"status": false, "message": err});
        if (result.length > 0 && (result[0].Password === crypto.createHash('sha256').update(req.body.password).digest('hex'))) {
            res.json({
                "status": true,
                "message": "Welcome " + result[0].Username
            });
            req.session.regenerate(function (err) {
                // will have a new session here
            });
            req.session.username = req.body.username;
        } else {
            res.json({
                "status": false,
                "message": "Wrong username or password"
            });
        }
    });

    connection.end();
});

module.exports = router;
