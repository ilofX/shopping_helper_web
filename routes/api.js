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


    connection.query("INSERT INTO shop (Name, StreetName, StreetNumber, ZIPCode, City, addedBy) VALUES (?, ?, ?, ?, ?, ?);", [
        req.query.shopName,
        req.query.shopStreetName,
        req.query.shopStreetNumber,
        req.query.shopZIP,
        req.query.shopCity,
        req.session.userID
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

    connection.query("INSERT INTO product (Barcode, Name, Brand, addedBy) VALUES (?, ?, ?, ?);", [
        req.query.productBarcode,
        req.query.productName,
        req.query.productBrand,
        req.session.userID
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
        database: 'shopping_helper',
        multipleStatements: true
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

    connection.query("SELECT product.Barcode, product.Name, sold.Price, DATE_FORMAT(sold.LastUpdate,'%d-%m-%Y') AS LastUpdate, shop.Name AS 'shopName', shop.City FROM product, sold, shop WHERE sold.ShopID = shop.ID AND product.Barcode = sold.ProductBarcode GROUP BY product.Barcode HAVING sold.Price = MIN(sold.Price); SELECT product.Barcode, product.Name FROM product WHERE product.Barcode NOT IN (SELECT product.Barcode FROM product, sold WHERE product.Barcode = sold.ProductBarcode);", function (err, result) {
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
                for (let i = 0; i < result[0].length; i++) {
                    ris.products.push({
                        'Barcode': result[0][i].Barcode,
                        'Name': result[0][i].Name,
                        'Price': result[0][i].Price,
                        'LastUpdate': result[0][i].LastUpdate,
                        'shop': result[0][i].shopName + ", " + result[0][i].City
                    });
                }

                for (let i = 0; i < result[1].length; i++) {
                    ris.products.push({
                        'Barcode': result[1][i].Barcode,
                        'Name': result[1][i].Name,
                        'Price': ' ',
                        'LastUpdate': ' ',
                        'shop': ' '
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

    connection.query("INSERT INTO sold (ProductBarcode, ShopID, Price, Quantity, PriceAtUnit, Offer, addedBy) VALUES (?, ?, ?, ?, ?, ?, ?);", [
        req.query.productBarcode,
        req.query.shopID,
        req.query.price,
        req.query.quantity,
        req.query.pricePerUnit,
        req.query.isOnSale,
        req.session.userID
    ], function (err, result) {
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

router.get('/productdetails', chechAuth, function (req, res, next) {
    var connection = mysql.createConnection({
        host: '192.168.3.240',
        user: 'shopping_helper',
        password: 'qNqz3PKKZ',
        database: 'shopping_helper',
        multipleStatements: true
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

    connection.query("SELECT product.Barcode, product.Name, product.Brand, sold.Price, DATE_FORMAT(sold.LastUpdate, '%d-%m-%Y') AS 'LastUpdate', sold.Offer FROM product, sold, shop WHERE product.Barcode = sold.ProductBarcode AND sold.ShopID = shop.ID AND Barcode = ? GROUP BY product.Barcode HAVING sold.Price <= MIN(sold.Price); SELECT shop.Name, shop.StreetName, shop.StreetNumber, shop.ZIPCode, shop.City, sold.Price, DATE_FORMAT(sold.LastUpdate, '%d-%m-%Y') AS 'LastUpdate', sold.Offer FROM shop, sold, product WHERE shop.ID = sold.ShopID AND product.Barcode = sold.ProductBarcode AND product.Barcode = ?", [
        req.query.Barcode,
        req.query.Barcode
    ], function (err, result) {
        if (err) {
            return res.json({
                "status": false,
                "message": err
            });
        } else {
            if (result != null && result.length >= 0) {
                let ris = {
                    'status': true,
                    'Barcode': result[0][0].Barcode,
                    'Name': result[0][0].Name,
                    'Brand': result[0][0].Brand,
                    'BestPrice': result[0][0].Price,
                    'LastUpdate': result[0][0].LastUpdate,
                    'isOffer': result[0][0].Offer,
                    'shops': []
                };

                for (let i = 0; i < result[1].length; i++) {
                    ris.shops.push({
                        'Name': result[1][i].Name,
                        'Location': result[1][i].StreetName + ", " + result[1][i].StreetNumber + " " + result[1][i].ZIPCode + ", " + result[1][i].City,
                        'Price': result[1][i].Price,
                        'isOffer': result[1][i].Offer,
                        'LastUpdate': result[1][i].LastUpdate
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

router.get('/shopdetails', chechAuth, function (req, res, next) {
    var connection = mysql.createConnection({
        host: '192.168.3.240',
        user: 'shopping_helper',
        password: 'qNqz3PKKZ',
        database: 'shopping_helper',
        multipleStatements: true
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

    connection.query("SELECT shop.ID, shop.Name, shop.StreetName, shop.StreetNumber, shop.ZIPCode, shop.City FROM shop WHERE shop.ID = ?; SELECT product.Barcode, product.Name, product.Brand, sold.Price, DATE_FORMAT(sold.LastUpdate,'%d-%m-%Y') AS LastUpdate, sold.Offer FROM product, shop, sold WHERE product.Barcode = sold.ProductBarcode AND sold.ShopID = shop.ID AND shop.ID = ?;", [
        req.query.ID,
        req.query.ID
    ], function (err, result) {
        if (err) {
            return res.json({
                "status": false,
                "message": err
            });
        } else {
            if (result != null && result.length >= 0) {
                let ris = {
                    'status': true,
                    'ID': result[0][0].ID,
                    'Name': result[0][0].Name,
                    'Location': result[0][0].StreetName + ", " + result[0][0].StreetNumber + " " + result[0][0].ZIPCode + ", " + result[0][0].City,
                    'products': []
                };

                for (let i = 0; i < result[1].length; i++) {
                    ris.products.push({
                        'Barcode': result[1][i].Barcode,
                        'Name': result[1][i].Name,
                        'Price': result[1][i].Price,
                        'LastUpdate': result[1][i].LastUpdate,
                        'isOffer': result[1][i].Offer
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


module.exports = router;
