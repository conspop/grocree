const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
  ingredientName: String,
  section: String
});

module.exports = mongoose.model('Ingredient', ingredientSchema);