/* ------------
    Imports     
--------------- */

//node_modules
const multer = require('multer');



//Dictionnaire des extensions. Ex : .jpeg deviendra .jpg
const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
};

const storage = multer.diskStorage({
    //Indique à multer d'enregistrer les fichiers dans images/
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    //Indique à multer de récupérer le nom d'origine, de remplacer les espaces par des underscores, j'ajouter la date (pour un titre unique)
    //et d'ajouter l'extention appropriée grâce au dictionnaire des extentions
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});



/* ------------
    Exports     
--------------- */

//Export de multer avec sa config contenu dans storage et indication de ne prendre en compte que les fichiers de type image
module.exports = multer({storage: storage}).single('image');