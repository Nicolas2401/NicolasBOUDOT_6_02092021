/* ------------
    Imports     
--------------- */

//node_modules
const express = require('express');
const router = express.Router();

//controllers
const userCtrl = require('../controllers/user');



/* ------------
    Routes           
--------------- */

router.post("/signup", userCtrl.signUp);
router.post("/login", userCtrl.logIn);

//Ajout de la possibilité de supprimer son profil
router.delete("/profils/:id", userCtrl.deleteProfil);


/* ------------
    Exports           
--------------- */

module.exports = router;