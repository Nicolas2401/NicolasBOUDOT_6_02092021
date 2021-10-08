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
    //Si un fichier est transmis
    if (req.file) {
        //On récupère l'objet voulu
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                //On fragmente l'url pour extraire le nom du fichier
                const filename = sauce.imageUrl.split('/images/')[1];
                //fs.unlink supprime le fichier et envoi un callback a executé ensuite (Sauce.updateOne)
                fs.unlink(`images/${filename}`, () => {
                    //Création de l'objet sauceObject après vérification de l'existence de req.file
                    const sauceObject = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    };
                    
                    // Récupère le produit par son /:id et le remplace par le nouveau en vérifiant qu'il s'agisse bien de ce même id
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({message: "Objet modifié !"}))
                        .catch(error => res.status(400).json({ error }));
                })
            })
            .catch( error => res.status(500).json({ error }));
    }

    else {
        //Création de l'objet sauceObject après vérification de l'existence de req.file
        const sauceObject = {
            ...req.body
        };
        
        // Récupère le produit par son /:id et le remplace par le nouveau en vérifiant qu'il s'agisse bien de ce même id
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({message: "Objet modifié !"}))
            .catch(error => res.status(400).json({ error }));
    }
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

exports.likeSauce = (req, res, next) => {
    console.log("------------------------------");

    console.log("req.body :", req.body);

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const sauceObject = {};

            console.log("sauce BEFORE", sauce);

            //Si on like
            if (req.body.like == 1) {
                //On ajoute (en 2 temps, sinon = .length) l'id de l'utilisateur qui like
                sauce.usersLiked.push(req.body.userId);

                //On attribut à l'objet les nouvelles infos
                sauceObject.usersLiked = sauce.usersLiked;
                sauceObject.likes = sauce.usersLiked.length;
            }

            //Sinon, si on retire le like
            else if (req.body.like == 0) {
                //On enlève (en 2 temps) l'id des Likes ou des Dislikes
                const newUsersLiked = sauce.usersLiked.filter(id => id !== req.body.userId);
                const newUsersDisliked = sauce.usersDisliked.filter(id => id !== req.body.userId);

                //On attribut à l'objet les nouvelles infos
                sauceObject.usersLiked = newUsersLiked;
                sauceObject.usersDisliked = newUsersDisliked;
                sauceObject.likes = newUsersLiked.length;
                sauceObject.dislikes = newUsersDisliked.length;
            }

            //Sinon, si on dislike
            else if (req.body.like == -1) {
                //On ajoute (en 2 temps, sinon = .length) l'id de l'utilisateur qui dislike
                sauce.usersDisliked.push(req.body.userId);

                //On attribut à l'objet les nouvelles infos
                sauceObject.usersDisliked = sauce.usersDisliked;
                sauceObject.dislikes = sauce.usersDisliked.length;
            }

            console.log("sauceObject :", sauceObject);

            // Récupère le produit par son /:id et le remplace par le nouveau en vérifiant qu'il s'agisse bien de ce même id
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({message: "Objet modifié !"}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch( error => res.status(500).json({ error }));
};