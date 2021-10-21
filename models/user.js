/* ------------
    Imports     
--------------- */

//node_modules
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



/* ------------
    Schéma     
--------------- */

//Création du schéma de données pour chaque User
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

//Vérification que l'email n'est pas déjà utilisé
userSchema.plugin(uniqueValidator);



/* ------------
    Exports     
--------------- */

//Export du schéma pour qu'il soit dispo avec Express
module.exports = mongoose.model("User", userSchema);