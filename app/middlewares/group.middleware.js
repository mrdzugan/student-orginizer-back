const db = require("../models");
const Group = db.group;

const checkDuplicateGroup = (req, res, next) => {
    Group.findOne({
        name: req.body.name,
        faculty: req.body.faculty
    }).exec((err, group) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (group) {
            res.status(400).send({ message: "Така група вже існує!" });
            return;
        }
        next();
    });
};

const groupMiddleware = {
    checkDuplicateGroup
};

module.exports = groupMiddleware;