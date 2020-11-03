const User = require('../models/user');
const Recipe = require('../models/recipe')
const List = require('../models/list')
const Ingredient = require('../models/ingredient')

module.exports = {
  new: newList,
  create,
  edit,
  addIngredient,
  index,
  show,
  deleteIngredient,
  deleteList
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
          if (groceryList[s.ingredient._id]) {
            groceryList[s.ingredient._id].push(s.amount)
          } else {
            groceryList[s.ingredient._id]= [s.amount]
          }
        })
      }
      let recipes = (typeof(req.body.recipes) === 'string') ? req.body.recipes.split() : req.body.recipes;
      recipes.forEach(r => {
        user.recipes[r].recipeIngredients.forEach(rI => {
          let ingredient = (ingredients.find(i => i._id.equals(rI.ingredient)))
          if (groceryList[ingredient._id]) {
            groceryList[ingredient._id].push(rI.amount)
          } else {
            groceryList[ingredient._id]= [rI.amount]
          }
        })
      })
      groceryList = Object.entries(groceryList)
      groceryList.forEach(g => {
        newList.listIngredients.push({ingredient: g[0], amount: g[1]})
      })
      newList.save()
      req.user.lists.push(newList._id)
      req.user.save()
      res.redirect(`/lists/${newList._id}`)
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
  List.findById(req.params.listId, function(err, list) {
    Ingredient.findOne({ingredientName: req.body.ingredientName}, function(err, ingredient) {
      if (ingredient === null) {
        newIngredient = new Ingredient()
        newIngredient.ingredientName = req.body.ingredientName
        newIngredient.save(function(err, newIngredient) {
          list.listIngredients.push({ingredient: newIngredient._id, amount: req.body.amount})
          list.save()
          res.redirect(`/lists/${list._id}`)
        })
      } else {
        list.listIngredients.push({ingredient: ingredient._id, amount: req.body.amount})
        list.save()
        res.redirect(`/lists/${list._id}`)
      }
    })
  })
}

function show(req, res) {
  List.findById(req.params.listId).populate('listIngredients.ingredient').exec(function(err, list) {
    res.render('lists/show', {user:req.user, list})
  })
}

function deleteIngredient(req, res) {
  List.findById(req.params.listId, function(err, list) {
    let index = list.listIngredients.findIndex(i => i.ingredient._id.equals(req.params.ingredientId))
    list.listIngredients[index].remove()
    list.save(function(err) {
      res.redirect(`/lists/${list._id}`)
    })
  })
}

function deleteList(req, res) {
  List.findByIdAndDelete(req.params.listId, function(err) {
    res.redirect('/lists')
  })
}

