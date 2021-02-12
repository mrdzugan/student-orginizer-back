const config = require("../config/auth.config");
const User = require("../models/user.model");
const Role = require("../models/role.model");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        faculty: req.body.faculty,
        group: req.body.group,
        authorities: [],
        password: bcrypt.hashSync(req.body.password, 8)
    });

    if (req.body.roles) {
        Role.find(
            { name: { $in: req.body.roles } },
            (err, roles) => {
                if (err) {
                    console.error(err);
                    res.status(500).send({ message: err });
                    return;
                }
                user.roles = roles.map(role => role._id);
                user.authorities = roles.map(role => role.name);
            }
        );
    } else {
        Role.findOne({ name: "user" }, (err, role) => {
            if (err) {
                console.error(err);
                res.status(500).send({ message: err });
                return;
            }
            user.roles = [role._id];
            user.authorities = [role.name];
        });
    }

    user.save((err, user) => {
        if (err) {
            console.error(err);
            res.status(500).send({ message: err });
            return;
        }

        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
        });

        const authorities = user.authorities.map(role => `ROLE_${role.toUpperCase()}`);

        return res.status(201).send({
            id: user._id,
            name: user.name,
            surname: user.surname,
            faculty: user.faculty,
            group: user.group,
            email: user.email,
            roles: authorities,
            accessToken: token
        });
    });
};

exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .populate("roles", "-__v")
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            const isPasswordValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!isPasswordValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            const authorities = user.roles.map(role => `ROLE_${role.name.toUpperCase()}`);

            res.status(200).send({
                id: user._id,
                name: user.name,
                surname: user.surname,
                faculty: user.faculty,
                group: user.group,
                email: user.email,
                roles: authorities,
                accessToken: token
            });
        });
};