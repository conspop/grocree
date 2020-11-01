var express = require('express');
var router = express.Router();

var staplesCtrl = require('../controllers/staples')

router.get('/', isLoggedIn, staplesCtrl.index);

router.post('/', staplesCtrl.addStaple);

function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) return next();
  res.redirect('/users//auth/google');
}


module.exports = router;
