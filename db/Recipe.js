const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    label: String,
    image: String,
    ingredients:[{type:String}],
    steps:String
});

module.exports = mongoose.model("recipes", recipeSchema);