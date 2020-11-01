const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = new Schema({
  listName: String,
  ingredients: [{ingredient: String, Amount: String, Section: String}]
});

module.exports = mongoose.model('List', listSchema);