/* ------------
    Imports     
--------------- */

//node_modules
const express = require("express");
const router = express.Router();

//controllers
const sauceCtrl = require('../controllers/sauce');



/* ---------
    ROUTES  
------------ */

router.post("/", sauceCtrl.createSauce);

router.put("/:id", sauceCtrl.modifySauce);

router.delete("/:id", sauceCtrl.deleteSauce);

// :id ==> paramètre dynamique
router.get("/:id", sauceCtrl.getOneSauce);
router.get("/", sauceCtrl.getAllSauces);

//All - Version dur
// router.get("/", sauceCtrl.getAllSaucesTest);



/* ---------
    EXPORTS  
------------ */

//Export du router pour utilisation ailleurs
module.exports = router;