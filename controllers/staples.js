const User = require('../models/user');
const Recipe = require('../models/recipe')
const List = require('../models/list')
const Ingredient = require('../models/ingredient')

module.exports = {
  addStaple,
  index,
  deleteIngredient
};

function addStaple(req, res) {
  User.findById(req.user._id).populate('ingredients').exec(function(err, user) {
    let index = user.ingredients.findIndex(i => i.ingredientName.toLowerCase() === req.body.ingredientName.toLowerCase())
    if (index === -1) {
      let newIngredient = new Ingredient();
      newIngredient.ingredientName = req.body.ingredientName;
      newIngredient.save();
      user.staples.push({ingredient: newIngredient._id, amount:req.body.amount});
      user.ingredients.push(newIngredient._id);
      user.save();
    } else {
      user.staples.push({ingredient: user.ingredients[index]._id, amount:req.body.amount})
      user.save()
    }
    res.redirect('/staples')
  })
}

function index(req, res) {
  User.findById(req.user._id).populate('staples').populate('staples.ingredient').exec(function(err, user) {
    console.log(user.staples[0].ingredient.ingredientName > user.staples[1].ingredient.ingredientName)
    user.staples.sort((a,b) => {
      if (a.ingredient.ingredientName.toLowerCase() > b.ingredient.ingredientName.toLowerCase()) return 1
      else if (a.ingredient.ingredientName.toLowerCase() < b.ingredient.ingredientName.toLowerCase()) return -1
    })
    res.render('staples/index', {user})
  })
}

function deleteIngredient(req, res) {
  let index = req.user.staples.findIndex(s => s.ingredient.equals(req.params.ingredientId))
  req.user.staples[index].remove()
  req.user.save()
  res.redirect('/staples')
}