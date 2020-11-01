const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  recipeName: String,
  recipeIngredients: [{ingredient: {type: Schema.Types.ObjectId, ref: 'Ingredient'}, amount: String}]
});

module.exports = mongoose.model('Recipe', recipeSchema);