var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login', {title: 'Shopping Helper Login'});
});

router.post('/', function(req, res, next) {
  console.log(req.body.username);
  console.log(req.body.password);
  res.json({"message": "Success or super hero squad!!!",});

});

module.exports = router;
