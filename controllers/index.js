const User = require('../models/user');
const Recipe = require('../models/recipe')
const List = require('../models/list')

module.exports = {
  index
};

function index(req, res) {
  res.render('index', {user:req.user})
}