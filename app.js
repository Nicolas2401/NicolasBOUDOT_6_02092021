/* ------------
    Imports     
--------------- */

//node_modules
const express = require("express");
// const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//routes
const sauceRoutes = require("./routes/sauce");



/* ------------
    Connection           
--------------- */

//Connection avec MongoDB grâce à Mongoose
mongoose.connect('mongodb+srv://nicolas:123@clusterhottakes.noxyx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Appel de la méthode Express
const app = express();



/* ------------
    Middlewares           
--------------- */

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

//Configuration du router
app.use("/api/sauces", sauceRoutes);



/* ------------
    Exports           
--------------- */

//Export de l'app pour utilisation ailleurs
module.exports = app;