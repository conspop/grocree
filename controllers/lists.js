const User = require('../models/user');
const Recipe = require('../models/recipe')
const List = require('../models/list')
const Ingredient = require('../models/ingredient')

module.exports = {
  new: newList,
  create,
  edit,
  addIngredient,
  index
};

function index(req, res) {
  User.findById(req.user._id).populate('lists').exec(function(err, user) {
    res.render('lists/index', {user})
  })
}

function newList(req, res) {
  User.findById(req.user._id).populate('recipes').exec(function(err, user) {
    res.render('lists/generator', {user})
  })
}

function create(req, res) {
  User.findById(req.user._id).populate('recipes').populate('recipes.recipeIngredients').populate('recipes.recipeIngredients.ingredient').populate('staples').populate('staples.ingredient').exec(function(err, user) {
    Ingredient.find({}, function (err, ingredients) {
      let newList = new List();
      newList.listName = req.body.listName;
      let groceryList = {}
      if (req.body.staples === 'Yes') {
        user.staples.forEach(s => {
          if (groceryList[s.ingredient.ingredientName]) {
            groceryList[s.ingredient.ingredientName].push(s.amount)
          } else {
            groceryList[s.ingredient.ingredientName]= [s.amount]
          }
        })
      }
      req.body.recipes.forEach(r => {
        user.recipes[r].recipeIngredients.forEach(rI => {
          let ingredient = (ingredients.find(i => i._id.equals(rI.ingredient)))
          if (groceryList[ingredient.ingredientName]) {
            groceryList[ingredient.ingredientName].push(rI.amount)
          } else {
            groceryList[ingredient.ingredientName]= [rI.amount]
          }
        })
      })
      console.log(groceryList)
    })
  })
}

function edit(req, res) {
  List.findById(req.params.listId).populate('recipes').exec(function(err, list) {
    Recipe.find({}, function(err, recipes) {
      res.render('lists/generator', {list, recipes, user: req.user})
    })
  })
}

function addIngredient(req, res) {
  Recipe.findById(req.params.recipeId, function(err, recipe) {
    Ingredient.findOne({ingredientName: req.body.ingredientName}, function(err, ingredient) {
      if (ingredient === null) {
        newIngredient = new Ingredient()
        newIngredient.ingredientName = req.body.ingredientName
        newIngredient.save(function(err, newIngredient) {
          recipe.recipeIngredients.push({ingredient: newIngredient._id, amount: req.body.amount})
          recipe.save()
          res.redirect(`/recipes/${recipe._id}`)
        })
      }
    })
  })
}

