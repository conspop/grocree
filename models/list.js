const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = new Schema({
  listName: String,
  listIngredients: [{ingredient:{type: Schema.Types.ObjectId, ref: 'Ingredient'}, amount: [String]}]
});

module.exports = mongoose.model('List', listSchema);