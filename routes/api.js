var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.redirect('/');
});

router.get('/login', function (req, res, next) {
  res.render('this is a valid api call');
});

module.exports = router;
