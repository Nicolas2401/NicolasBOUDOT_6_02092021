/* ------------
    Imports     
--------------- */

//node_modules
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//models
const User = require("../models/user");



/* ------------ 
    Controllers      
--------------- */

//Création et export de la fonction
exports.signUp = (req, res, next) => {
    //Hash le mdp 10x
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });

            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur créé !"}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.logIn = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            //Si l'utilisateur n'est pas trouvé
            if (!user) {
                //On retourne une erreur
                return res.status(401).json({ error: "Utilisateur non trouvé !" });
            }
            //Sinon, on compare le mdp saisi avec celui dans le bdd
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    //Si le mdp n'est pas correct
                    if(!valid) {
                        //On retourne une erreur
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    //Sinon, on renvoie l'ID et le Token
                    res.status(200).json({
                        userId: user._id,
                        //Encode un token
                        token: jwt.sign(
                            //Le token contient l'Id de l'utilisateur
                            { userId: user._id },
                            //Encode le token selon la chaîne de caractère suivante (à complexifier en prod)
                            'RANDOM_TOKEN_SECRET',
                            //Validiter du token. Après ce délai, il faudra se reconnecter
                            { expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};