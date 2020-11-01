const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  googleId: String,
  name: String,
  email: String,
  recipes: [{type: Schema.Types.ObjectId, ref: 'Recipe'}],
  staples: [{
    ingredient: {type: Schema.Types.ObjectId, ref: 'Ingredient'},
    amount: String
  }],
  lists: [{type: Schema.Types.ObjectId, ref: 'List'}]
});

module.exports = mongoose.model('User', userSchema);