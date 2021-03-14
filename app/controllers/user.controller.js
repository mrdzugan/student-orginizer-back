const db = require('../models');
const User = db.user;

exports.allAccess = (req, res) => {
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
};

exports.getUser = (req, res) => {
    User.find(
        { _id: req.params.id },
        (err, user) => {
            if (err) {
                console.error(err);
                res.status(500).send({ message: err });
                return;
            }
            res.status(200).send(user);
        }
    );
};