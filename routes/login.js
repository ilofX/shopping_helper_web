var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'shopping helper - login' });
});

router.post('/', function(req, res, next) {
  console.log(req.body.username);
  console.log(req.body.password);


});


module.exports = router;
