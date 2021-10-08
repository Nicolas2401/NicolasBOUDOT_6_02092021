/* ------------
    Imports     
--------------- */

//node_modules
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

//models
const User = require("../models/user");



/* ------------ 
    Controllers      
--------------- */

//Création et export de la fonction
exports.signUp = (req, res, next) => {
    //Encrypte l'email selon une clé et une IV (Initialization Vector : bloc de bits combiné avec le premier bloc de données)
    var key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
    var iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");

    var emailCrypted = CryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString();
    //Si besoin de décryptage
    // var emailDecrypted = CryptoJS.AES.decrypt(emailCrypted, key, { iv: iv }).toString(CryptoJS.enc.Utf8);

    //Hash le mdp 10x
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                // email: req.body.email,
                email: emailCrypted,
                password: hash
            });

            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur créé !"}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};



exports.logIn = (req, res, next) => {
    console.log(req.body);

    //Encrypte l'email selon une clé et une IV (Initialization Vector : bloc de bits combiné avec le premier bloc de données)
    var key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
    var iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");

    var emailCrypted = CryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString();
    //Si besoin de décryptage
    // var emailDecrypted = CryptoJS.AES.decrypt(emailCrypted, key, { iv: iv }).toString(CryptoJS.enc.Utf8);

    // User.findOne({ email: req.body.email })
    User.findOne({ email: emailCrypted })
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
                            // { expiresIn: 10}
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};



// Ajout de la possibilité de supprimer son profil
exports.deleteProfil = (req, res, next) => {
    User.deleteOne({ _id: req.params.id})
        .then(() => res.status(200).json({ message: "Profil supprimé!"}))
        .catch(error => res.status(400).json({ error }));
};