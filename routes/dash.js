var express = require('express');
var router = express.Router();

const redirectLogin = (req, res, next) => {
  if (!req.session.userID) {
    res.redirect('/');
  } else {
    next();
  }
}

/* GET dashboard page. */
router.get('/', redirectLogin, function (req, res, next) {
  res.render('dash', {title: 'Shopping Helper', user: req.session.username});
});


module.exports = router;
