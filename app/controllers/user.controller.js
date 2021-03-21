const db = require('../models');
const User = db.user;

/*exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.studentBoard = (req, res) => {
    res.status(200).send("Student Content.");
};

exports.curatorBoard = (req, res) => {
    res.status(200).send("Curator Content.");
};

exports.headmanBoard = (req, res) => {
    res.status(200).send("Headman Content.");
};*/

exports.getUser = (req, res) => {
    User.findOne(
        { _id: req.params.id })
        .populate('faculty group roles')
        .exec((err, user) => {
                if (err) {
                    console.error(err);
                    res.status(500).send({ message: err });
                    return;
                }
                user.roles.forEach((role, index) => user.roles[index] = `ROLE_${ role.name.toUpperCase() }`);
                res.status(200).send({ user });
            }
        );
};