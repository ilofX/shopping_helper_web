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
        req.query.shopStreetNumber,
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

router.get('/shopslist', chechAuth, function (req, res, next) {
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

    connection.query("SELECT ID,Name,StreetName,StreetNumber,ZIPCode,City FROM shop", function (err, result) {
        if (err) {
            return res.json({
                "status": false,
                "message": err
            });
        } else {
            if (result != null && result.length >= 0) {
                let ris = {
                    'status': true,
                    'shops': []
                }
                for (let i = 0; i < result.length; i++) {
                    ris.shops.push({
                        'ID': result[i].ID,
                        'Name': result[i].Name,
                        'Location': result[i].StreetName + ", " + result[i].StreetNumber + " " + result[i].ZIPCode + ", " + result[i].City
                    });
                }
                res.json(ris);
            } else {
                return res.json({
                    "status": false,
                });
            }
        }
    });

    connection.end();
});

router.get('/productslistcomplete', chechAuth, function (req, res, next) {
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

    connection.query("SELECT product.Barcode, product.Name, sold.Price, sold.LastUpdate FROM product, sold WHERE product.Barcode = sold.ProductBarcode GROUP BY product.Barcode HAVING sold.Price = MIN(sold.Price)", function (err, result) {
        if (err) {
            return res.json({
                "status": false,
                "message": err
            });
        } else {
            if (result != null && result.length >= 0) {
                let ris = {
                    'status': true,
                    'products': []
                }
                for (let i = 0; i < result.length; i++) {
                    ris.products.push({
                        'Barcode': result[i].Barcode,
                        'Name': result[i].Name,
                        'Price': result[i].Price,
                        'LastUpdate': result[i].LastUpdate
                    });
                }
                res.json(ris);
            } else {
                return res.json({
                    "status": false,
                });
            }
        }
    });

    connection.end();
});


router.get('/productslist', chechAuth, function (req, res, next) {
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

    connection.query("SELECT Barcode,Name FROM product", function (err, result) {
        if (err) {
            return res.json({
                "status": false,
                "message": err
            });
        } else {
            if (result != null && result.length >= 0) {
                let ris = {
                    'status': true,
                    'products': []
                }
                for (let i = 0; i < result.length; i++) {
                    ris.products.push({
                        'Barcode': result[i].Barcode,
                        'Name': result[i].Name
                    });
                }
                res.json(ris);
            } else {
                return res.json({
                    "status": false,
                });
            }
        }
    });

    connection.end();
});

router.get('/registersale', chechAuth, function (req, res, next) {
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

    connection.query("INSERT INTO sold (ProductBarcode, ShopID, Price, Quantity, PriceAtUnit, Offer) VALUES (?, ?, ?, ?, ?, ?);",[
        req.query.productBarcode,
        req.query.shopID,
        req.query.price,
        req.query.quantity,
        req.query.pricePerUnit,
        req.query.isOnSale
        ],
    function (err, result) {
        if (err) {
            return res.json({
                "status": false,
                "message": err
            });
        } else {
            if (result != null && result.affectedRows >= 0) {
                res.json({
                    'status': true
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
