const db = require('../models');
const User = db.user;

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