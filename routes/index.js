var express = require('express');
var router = express.Router();

var indexCtrl = require('../controllers/index')

router.get('/', function(req, res, next) {
  if (req.user) {
    res.redirect('/lists');
  } else {
    res.render('index', {user: req.user});
  }
});

function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) return next();
  res.redirect('/users/oauth2callback');
}

module.exports = router;
