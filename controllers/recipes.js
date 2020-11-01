const User = require('../models/user');
const Recipe = require('../models/recipe')
const List = require('../models/list')
const Ingredient = require('../models/ingredient')

module.exports = {
  create,
  edit,
  addIngredient,
  index,
  deleteIngredient
};

function index(req, res) {
  User.findById(req.user._id).populate('recipes').exec(function(err, user) {
    res.render('recipes/index', {user})
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
    res.render('recipes/update', {recipe, ingredients, user: req.user})
  })
}

function addIngredient(req, res) {
  Recipe.findById(req.params.recipeId, function(err, recipe) {
    Ingredient.findOne({ingredientName: req.body.ingredientName}, function(err, ingredient) {
      console.log(ingredient)
      if (ingredient === null) {
        newIngredient = new Ingredient()
        newIngredient.ingredientName = req.body.ingredientName
        newIngredient.save(function(err, newIngredient) {
          recipe.recipeIngredients.push({ingredient: newIngredient._id, amount: req.body.amount})
          recipe.save()
          res.redirect(`/recipes/${recipe._id}`)
        })
      } else {
        recipe.recipeIngredients.push({ingredient: ingredient._id, amount: req.body.amount})
          recipe.save()
          res.redirect(`/recipes/${recipe._id}`)
      }
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

