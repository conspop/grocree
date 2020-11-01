var express = require('express');
var router = express.Router();

var indexCtrl = require('../controllers/index')

router.get('/', isLoggedIn, indexCtrl.index);

function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) return next();
  res.redirect('/users//auth/google');
}

module.exports = router;
