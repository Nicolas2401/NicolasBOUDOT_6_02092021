/* ------------
    Imports     
--------------- */

//node_modules
const express = require("express");
const router = express.Router();

//models
const Sauce = require("./models/sauce");



/* ---------
    ROUTES  
------------ */

//POST Only (before All to filter req.post)
router.post("/", (req, res, next) => {
    //Suppression de l'id généré par le frontend
    delete req.body._id;

    //Création d'une instance du modèle Thing
    const sauce = new Sauce({
        ...req.body
        //Raccourci de
        // title: req.body.title,
        // description: req.body.description
        // etc.
    });

    //Sauvegarde de l'objet créé dans mongoDB
    sauce.save()
        .then(() => res.status(201).json({ sauce }))
        .catch(error => res.status(400).json({ error }));
        //Raccourci de 
        // .catch(error => res.status(400).json({ error: error }));
});


//GET Only
// :id ==> paramètre dynamique
router.get("/:id", (req, res, next) => {
    //Trouver le Thing ayant le même _id que le paramètre de requête (/:id)
    Sauce.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json({ sauce }))
        .catch(error => res.status(404).json({ error }));
});

//PUT Only
router.put("/:id", (req, res, next) => {
    //Mettre à jour le produit en cours
    //Récupère le produit par son /:id et le remplace par le nouveau en vérifiant qu'il s'agisse bien de ce même id
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch(error => res.status(400).json({ error }));
});

//DELETE Only
router.delete("/:id", (req, res, next) => {
    //Suppression du Thing ayant le même id que celui de la page en cours
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet supprimé!"}))
        .catch(error => res.status(400).json({ error }));
});


//All
// router.get("/", (req, res, next) => {
//     //Méthode find() de mongoose pour renvoyer un [] de Things de notre BDD
//     Sauce.find()
//         .then(things => res.status(200).json({ sauce }))
//         .catch(error => res.status(400).json({ error }));
// });

//All - Version dur
router.get("/", (req, res, next) => {
    const sauces = [
        {
            _id: 'oeihfzeoi',
            title: 'Mon premier objet',
            description: 'Les infos de mon premier objet',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            price: 4900,
            userId: 'qsomihvqios',
        },
        {
            _id: 'oeihfzeomoihi',
            title: 'Mon deuxième objet',
            description: 'Les infos de mon deuxième objet',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            price: 2900,
            userId: 'qsomihvqios',
        },
    ];
    res.status(200).json(sauces);
});



/* ---------
    EXPORTS  
------------ */

//Export du router pour utilisation ailleurs
module.exports = router;