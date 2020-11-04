const User = require('../models/user');
const Recipe = require('../models/recipe')
const List = require('../models/list')
const Ingredient = require('../models/ingredient')

module.exports = {
  index,
  updateSection
};

function index(req, res) {
  User.findById(req.user._id).populate('ingredients').exec(function(err, user) {
    res.render('ingredients/index', {user})
  })
}

function updateSection(req, res) {
  Ingredient.findById(req.body.ingredient, function(err, ingredient) {
    let updatedSection = String(req.body.updatedSection)
    console.log(updatedSection)
    ingredient.section = updatedSection
    ingredient.save(function(err) {
      res.json('ok!');
    })
  })
}
