/* ------------
    Imports     
--------------- */

//nodes_modules
const fs = require('fs'); //fs : file system => donne accès aux fonctions de modification de système de fichiers 

//models
const Sauce = require("../models/sauce");



/* ------------ 
    Controllers      
--------------- */

//Création et export de la fonction
exports.createSauce = (req, res, next) => {
    //Pour ajouter un fichier à la requête, le front-end doit envoyer les données de la requête sous la forme form-data, et non sous forme de JSON.
    //Le corps de la requête contient une chaîne sauce , qui est simplement un objet Sauce converti en chaîne.
    //Nous devons donc l'analyser à l'aide de JSON.parse() pour obtenir un objet utilisable.
    const sauceObject = JSON.parse(req.body.sauce);

    //Suppression de l'id généré par le frontend
    delete sauceObject._id;

    //Création d'une instance du modèle sauce
    const sauce = new Sauce({
        ...sauceObject,
        //Raccourci de (contenu dans req.body.sauce) :
        // title: req.body.title,
        // description: req.body.description
        // etc.

        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        // URL dynamique :
        // ${req.protocol} = http, ${req.get('host')} = localhost:3000 et ${req.file.filename} = le nom du fichier généré par multer

        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });

    //Sauvegarde de l'objet créé dans mongoDB
    sauce.save()
        .then(() => res.status(201).json({message: "Objet enregistré !"}))
        // .catch(error => res.status(400).json({ error }));
        .catch(error => res.status(400).json( "Test erreur de save dans Mongo" ));
        //Raccourci de 
        // .catch(error => res.status(400).json({ error: error }));
};

exports.modifySauce = (req, res, next) => {
    //On récupère l'objet voulu
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //On fragmente l'url pour extraire le nom du fichier
            const filename = sauce.imageUrl.split('/images/')[1];
            //fs.unlink supprime le fichier et envoi un callback a executé ensuite (Sauce.deleteOne)
            fs.unlink(`images/${filename}`, () => {
                //Création de l'objet sauceObject qui vérifie si req.file existe (avec un raccourci de if {} else {})
                const sauceObject = req.file 
                    //S'il existe, on traite la nouvelle image
                    ? {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    } 
                    //Sinon, on traite seulement l'objet entrant
                    : {
                        ...req.body
                    };
                
                //Récupère le produit par son /:id et le remplace par le nouveau en vérifiant qu'il s'agisse bien de ce même id
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({message: "Objet modifié !"}))
                    .catch(error => res.status(400).json({ error }));
                })
        })
        .catch( error => res.status(500).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    //On récupère l'objet voulu
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //On fragmente l'url pour extraire le nom du fichier
            const filename = sauce.imageUrl.split('/images/')[1];
            //fs.unlink supprime le fichier et envoi un callback a executé ensuite (Sauce.deleteOne)
            fs.unlink(`images/${filename}`, () => {
                //Suppression du Sauce ayant le même id que celui de la page en cours
                Sauce.deleteOne({ _id: req.params.id})
                    .then(() => res.status(200).json({ message: "Objet supprimé!"}))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch( error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    //Trouver la Sauce ayant le même _id que le paramètre de requête (/:id)
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    //Méthode find() de mongoose pour renvoyer un [] de Sauce de notre BDD
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

//getAllSauces - Version dur
// exports.getAllSaucesTest = (req, res, next) => {
//     const sauce = [
//         {
//             "usersLiked": [],
//             "usersDisliked": [],
//             "_id": "613de0f79534088318e86097",
//             "name": "Sauce1",
//             "manufacturer": "Manu1",
//             "description": "desc",
//             "mainPepper": "tabasco",
//             "heat": 4,
//             "userId": "613b25ca57ae6e3c4ca4056f",
//             "imageUrl": "http://localhost:3000/images/tabasco.jpg1631445239488.jpg",
//             "likes": 0,
//             "dislikes": 0,
//             "__v": 0
//         },
//         {
//             "usersLiked": [],
//             "usersDisliked": [],
//             "_id": "613de0f79534088318e86097",
//             "name": "Sauce2Test",
//             "manufacturer": "Manu2Test",
//             "description": "descTest",
//             "mainPepper": "tabascoTest2",
//             "heat": 2,
//             "userId": "613b25ca57ae6e3c4ca4056f",
//             "imageUrl": "http://localhost:3000/images/tabasco.jpg1631445239488.jpg",
//             "likes": 0,
//             "dislikes": 0,
//             "__v": 0
//         }
//     ];
//     res.status(200).json(sauce);
// };