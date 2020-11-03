var express = require('express');
var router = express.Router();

var recipesCtrl = require('../controllers/recipes')

router.get('/', isLoggedIn, recipesCtrl.index);
router.get('/:recipeId', isLoggedIn, recipesCtrl.edit);

router.delete('/:recipeId', recipesCtrl.deleteRecipe)
router.delete('/:recipeId/ingredient/:ingredientId', recipesCtrl.deleteIngredient)

router.post('/', recipesCtrl.create);
router.post('/:recipeId/ingredient', recipesCtrl.addIngredient);

function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) return next();
  res.redirect('/users//auth/google');
}

module.exports = router;
