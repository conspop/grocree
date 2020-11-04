var express = require('express');
var router = express.Router();

var ingredientsCtrl = require('../controllers/ingredients')

router.get('/', isLoggedIn, ingredientsCtrl.index);

router.post('/updatesection', ingredientsCtrl.updateSection)

function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) return next();
  res.redirect('/users//auth/google');
}

module.exports = router;
