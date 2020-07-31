var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const chechAuth = (req, res, next) => {
    if (!req.session.userID) {
        res.sendStatus(404);
    } else {
        next();
    }
}

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.redirect('/');
});


/**newShop api definition*/
router.get('/newshop', chechAuth, function (req, res, next) {

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

    connection.query("INSERT INTO shop (Name, StreetName, StreetNumber, ZIPCode, City) VALUES (?, ?, ?, ?, ?);", [
        req.query.shopName,
        req.query.shopStreetName,
        req.query.shopStreetNUmber,
        req.query.shopZIP,
        req.query.shopCity
    ], function (err, result) {
        if (err) {
            return res.json({
                "status": false,
                "message": err
            });
        } else {
            if (result != null && result.affectedRows === 1) {
                return res.json({
                    "status": true,
                });
            } else {
                return res.json({
                    "status": false,
                });
            }
        }
    });

    connection.end();
});

/**newProduct api definition*/
router.get('/newproduct', chechAuth, function (req, res, next) {

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

    connection.query("INSERT INTO product (Barcode, Name, Brand) VALUES (?, ?, ?);", [
        req.query.productBarcode,
        req.query.productName,
        req.query.productBrand,
    ], function (err, result) {
        if (err) {
            return res.json({
                "status": false,
                "message": err
            });
        } else {
            if (result != null && result.affectedRows === 1) {
                res.json({
                    "status": true,
                });
            } else {
                return res.json({
                    "status": false,
                });
            }
        }
    });

    connection.end();
});

module.exports = router;
