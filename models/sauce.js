/* ------------
    Imports     
--------------- */

//node_modules
const mongoose = require("mongoose");



/* ------------
    Schéma     
--------------- */

//Création du schéma de données pour chaque Sauce
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: [{ type: String, required: true }],
    usersDisliked: [{ type: String, required: true }],
});



/* ------------
    Exports           
--------------- */

//Export du schéma pour qu'il soit dispo avec Express
module.exports = mongoose.model("Sauce", sauceSchema);