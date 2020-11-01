var express = require('express');
var router = express.Router();

var listsCtrl = require('../controllers/lists');
const list = require('../models/list');

router.get('/', isLoggedIn, listsCtrl.index);
router.get('/new', isLoggedIn, listsCtrl.new);

router.post('/generated', listsCtrl.create);

function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) return next();
  res.redirect('/users//auth/google');
}

module.exports = router;
