const UserModel = require('../models/user.model');
const ObjectId = require('mongoose').Types.ObjectId; //ObjectId,type spécial utilisé pour les identifiants uniques

// Function trouve tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password'); // select -password permet d'éviter de faire transiter le password
    res.status(200).json(users)
}

// Function infos utilisateur
exports.userInfo = (req, res) => {
    // console.log(req.params);
    if (!ObjectId.isValid(req.params.id)) { // Methode de verification de l'ID passé en parametres
        return res.status(400).send('ID inconnu : ' + req.params.id)
    }

    UserModel.findById(req.params.id, (err, docs) => {
            if (!err) {
                res.send(docs)
            } else {
                console.log('ID inconnu : ' + err);
            }
        })
        .select('-password');
};

// Function mise a jour des données utilisateur
exports.updateUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    }

    try {
        UserModel.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    $set: { // BD noSql permet de seté des données qui ne sont pas obligatoires et d'ajouter une donnée' 
                        bio: req.body.bio
                    }
                }, {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true
                }, // parametres du PUT
            )
            .then((docs) => res.send(docs))
            .catch((err) => res.status(500).send({
                message: err
            }));
    } catch (err) {
        return res.status(500).json({
            message: err
        })
    }
};

// Function supprime l'utilisateur
exports.deleteUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id);
    }
    try {
        await UserModel.remove({
            _id: req.params.id
        }).exec();
        res.status(200).json({
            message: "Supprimé avec succès !"
        })
    } catch (err) {
        return res.status(500).json({
            message: err
        })
    }
}