/* ------------
    Imports     
--------------- */

//node_modules
const express = require("express");
const helmet = require("helmet");
// const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

//Variables d'environnement pour masqué des données sensibles (ID, MDP, TOKEN, etc.)
require("dotenv").config();

//routes
const sauceRoutes = require("./routes/sauce");
const userRoutes = require('./routes/user');



/* ------------
    Connection           
--------------- */

//Connection avec MongoDB grâce à Mongoose
mongoose.connect(process.env.DB_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Appel de la méthode Express
const app = express();



/* ------------
    Middlewares           
--------------- */
//Helmet (Empêche l'accès à nos cookie)
app.use(helmet());

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



/* ------------
    Router           
--------------- */

//Indique à Express de gérer les ressources de type images de manière static avec __dirname à chaque fois qu'elle reçoit un requête vers la route /images
app.use('/images/', express.static(path.join(__dirname, 'images')));

//Configuration du router
app.use("/api/sauces", sauceRoutes);
app.use('/api/auth', userRoutes);



/* ------------
    Exports           
--------------- */

//Export de l'app pour utilisation ailleurs
module.exports = app;