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

router.post('/logout', redirectLogin, function (req, res, next) {
  req.session.destroy(err => {
    if (err) {
      return res.json({
        "success": false
      });
    }
    res.clearCookie('sid');

    console.log('user logged out');

    res.json({
      "success": true
    });
  });
});


module.exports = router;
