const User = require('../models/user');
const Recipe = require('../models/recipe')
const List = require('../models/list')
const Ingredient = require('../models/ingredient')

module.exports = {
  addStaple,
  index
};

function addStaple(req, res) {
  Ingredient.findOne({ingredientName: req.body.ingredientName}).exec(function(err, ingredient) {
    if (ingredient === null) {
      newIngredient = new Ingredient()
      newIngredient.ingredientName = req.body.ingredientName
      newIngredient.save(function(err, newIngredient) {
        req.user.staples.push({ingredient: newIngredient._id, amount: req.body.amount})
        req.user.save()
        res.redirect('/staples')
      })
    }
  })
}

function index(req, res) {
  User.findById(req.user._id).populate('staples').populate('staples.ingredient').exec(function(err, user) {
    res.render('staples/index', {user})
  })
}