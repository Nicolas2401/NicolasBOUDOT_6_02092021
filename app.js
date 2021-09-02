//Import d'express et appel de sa méthode
const express = require("express");

//Import de body-parser
const bodyParser = require("body-parser");

//Import de Mongoose
const mongoose = require("mongoose");

//Import de notre modèle Thing
const Sauce = require("./models/sauce");


//Connection avec MongoDB grâce à Mongoose
mongoose.connect('mongodb+srv://nicolas:123@clusterhottakes.noxyx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//Appel de la méthode Express
const app = express();

//Middlewares
//Paramètres des headers
app.use((req, res, next) => {
    //Accès à l'API depuis n'importe quelle origin
    res.setHeader("Access-Control-Allow-Origin", "*");
    //Headers autorisés
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    //Méthodes autorisées
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});


//Traduction de la requête en json
// app.use(bodyParser.json());
app.use(express.json());


//Routes
//POST Only (before All to filter req.post)
app.post("/api/sauces", (req, res, next) => {
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
app.get("/api/sauces/:id", (req, res, next) => {
    //Trouver le Thing ayant le même _id que le paramètre de requête (/:id)
    Sauce.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json({ sauce }))
        .catch(error => res.status(404).json({ error }));
});

//PUT Only
app.put("/api/sauces/:id", (req, res, next) => {
    //Mettre à jour le produit en cours
    //Récupère le produit par son /:id et le remplace par le nouveau en vérifiant qu'il s'agisse bien de ce même id
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch(error => res.status(400).json({ error }));
});

//DELETE Only
app.delete("/api/sauces/:id", (req, res, next) => {
    //Suppression du Thing ayant le même id que celui de la page en cours
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet supprimé!"}))
        .catch(error => res.status(400).json({ error }));
});


//All
// app.get("/api/sauces", (req, res, next) => {
//     //Méthode find() de mongoose pour renvoyer un [] de Things de notre BDD
//     Sauce.find()
//         .then(things => res.status(200).json({ sauce }))
//         .catch(error => res.status(400).json({ error }));
// });

//All - Version dur
app.get("/api/sauces", (req, res, next) => {
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


//Export de l'app pour utilisation ailleurs
module.exports = app;