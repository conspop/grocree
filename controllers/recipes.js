const User = require('../models/user');
const Recipe = require('../models/recipe')
const List = require('../models/list')
const Ingredient = require('../models/ingredient')

module.exports = {
  create,
  edit,
  addIngredient,
  index,
  deleteIngredient,
  deleteRecipe
};

function index(req, res) {
  User.findById(req.user._id).populate('recipes').exec(function(err, user) {
    res.render('recipes/index', {user, page: 'recipes'})
  })
}

function create(req, res) {
  newRecipe = new Recipe()
  newRecipe.recipeName = req.body.recipeName;
  newRecipe.save()
  req.user.recipes.push(newRecipe._id)
  req.user.save()
  res.redirect(`/recipes/${newRecipe._id}`)
}

function edit(req, res) {
  Recipe.findById(req.params.recipeId).populate('recipeIngredients.ingredient').exec(function(err, recipe) {
    let ingredients = recipe.recipeIngredients
    res.render('recipes/update', {recipe, ingredients, user: req.user, page:'recipes'})
  })
}

function addIngredient(req, res) {
  Recipe.findById(req.params.recipeId, function(err, recipe) {
    User.findById(req.user._id).populate('ingredients').exec(function(err, user) {
      let index = user.ingredients.findIndex(i => i.ingredientName === req.body.ingredientName)
      if (index === -1) {
        let newIngredient = new Ingredient();
        newIngredient.ingredientName = req.body.ingredientName;
        newIngredient.save();
        recipe.recipeIngredients.push({ingredient: newIngredient._id, amount: req.body.amount})
        recipe.save()
        user.ingredients.push(newIngredient._id);
        user.save();
      } else {
        recipe.recipeIngredients.push({ingredient: user.ingredients[index]._id, amount: req.body.amount})
        recipe.save()
      }
      res.redirect(`/recipes/${recipe._id}`)
    })
  })
}

function deleteIngredient(req, res) {
  Recipe.findById(req.params.recipeId, function(err, recipe) {
    let index = recipe.recipeIngredients.findIndex(i => i.ingredient._id.equals(req.params.ingredientId))
    recipe.recipeIngredients[index].remove()
    recipe.save(function(err) {
      res.redirect(`/recipes/${recipe._id}`)
    })
  })
}

function deleteRecipe(req, res) {
  Recipe.findByIdAndDelete(req.params.recipeId, function(err) {
    res.redirect('/recipes')
  })
}

