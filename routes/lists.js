var express = require('express');
var router = express.Router();

var listsCtrl = require('../controllers/lists');
const list = require('../models/list');

router.get('/', isLoggedIn, listsCtrl.index);
router.get('/new', isLoggedIn, listsCtrl.new);
router.get('/:listId', isLoggedIn, listsCtrl.show)

router.delete('/removeingredient', listsCtrl.removeIngredient)
router.delete('/:listId', listsCtrl.deleteList)
router.delete('/:listId/ingredient/:ingredientId', listsCtrl.deleteIngredient)

router.put('/addingredient', isLoggedIn, listsCtrl.addIngredient)

router.post('/generated', listsCtrl.create);
router.post('/updateamount', listsCtrl.updateAmount)

function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) return next();
  res.redirect('/users//auth/google');
}

module.exports = router;
