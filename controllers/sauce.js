/* ------------
    Imports     
--------------- */

//models
const Sauce = require("./models/sauce");



/* ------------ 
    Controllers      
--------------- */

//Création et export de la fonction
exports.createSauce = (req, res, next) => {
    //Suppression de l'id généré par le frontend
    delete req.body._id;

    //Création d'une instance du modèle Sauce
    const sauce = new Sauce({
        ...req.body
        //Raccourci de
        // title: req.body.title,
        // description: req.body.description
        // etc.
    });

    //Sauvegarde de la sauce créée dans mongoDB
    sauce.save()
        .then(() => res.status(201).json({ sauce }))
        .catch(error => res.status(400).json({ error }));
        //Raccourci de 
        // .catch(error => res.status(400).json({ error: error }));
};

exports.modifySauce = (req, res, next) => {
    //Récupère la sauce par son /:id et la remplace par la nouvelle en vérifiant qu'il s'agisse bien de ce même id
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    //Suppression de la Sauce ayant le même id que celui de la page en cours
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet supprimé!"}))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    //Trouver la Sauce ayant le même _id que le paramètre de requête (/:id)
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json({ sauce }))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    //Méthode find() de mongoose pour renvoyer un [] de Sauce de notre BDD
    Sauce.find()
        .then(sauces => res.status(200).json({ sauces }))
        .catch(error => res.status(400).json({ error }));
};

//getAllSauces - Version dur
// exports.getAllSaucesTest = (req, res, next) => {
//     const sauce = [
//         {
//             _id: 'oeihfzeoi',
//             title: 'Mon premier objet',
//             description: 'Les infos de mon premier objet',
//             imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
//             price: 4900,
//             userId: 'qsomihvqios',
//         },
//         {
//             _id: 'oeihfzeomoihi',
//             title: 'Mon deuxième objet',
//             description: 'Les infos de mon deuxième objet',
//             imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
//             price: 2900,
//             userId: 'qsomihvqios',
//         },
//     ];
//     res.status(200).json(sauce);
// };