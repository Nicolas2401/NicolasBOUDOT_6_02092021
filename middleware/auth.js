/* ------------
    Imports     
--------------- */

//node_modules
const jwt = require('jsonwebtoken');



/* ------------
    Exports     
--------------- */

module.exports = (req, res, next) => {
    try {
        //Récupère la deuxième partie de l'authentification (Bearer xxx)
        const token = req.headers.authorization.split(' ')[1];
        //Décode le token grâce à la clé secret de logIn()
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        //Extraction de l'id du token, mis depuis logIn()
        const userId = decodedToken.userId;

        //Si la demande contient bien un id d'utilisateur, on le compare à celui extrait du token
        if (req.body.userId && req.body.userId !== userId) {
            //Stop la fonction et renvoi l'erreur à catch{}
            throw "ID Utilisateur invalide !";
        }
        else {
            next();
        }
    }
    catch {
        res.status(401).json({
            error: new Error('Requête invalide !')
        });
    }
}