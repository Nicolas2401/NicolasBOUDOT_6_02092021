/* ------------
    Imports     
--------------- */

//node_modules
const express = require("express");
const router = express.Router();

//middleware
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//controllers
const sauceCtrl = require('../controllers/sauce');



/* ---------
    ROUTES  
------------ */

/* /!\ Placer multer après auth car sinon même les img de requêtes non authentifiées seront enregistrer dans le serveur */
router.post("/", auth, multer, sauceCtrl.createSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);

router.put("/:id", auth, multer, sauceCtrl.modifySauce);

router.delete("/:id", auth, sauceCtrl.deleteSauce);

// :id ==> paramètre dynamique
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.get("/", auth, sauceCtrl.getAllSauces);

//All - Version dur
// router.get("/", auth, sauceCtrl.getAllSaucesTest);



/* ---------
    EXPORTS  
------------ */

//Export du router pour utilisation ailleurs
module.exports = router;