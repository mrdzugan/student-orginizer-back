const config = require('../config/auth.config');
const User = require('../models/user.model');
const Role = require('../models/role.model');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const registerUser = (user, res) => {
    user.save((err, user) => {
        if (err) {
            console.error(err);
            res.status(500).send({ message: err });
            return;
        }

        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
        });

        const authorities = user.authorities.map(role => `ROLE_${ role.toUpperCase() }`);

        return res.status(201).send({
            message: 'User successfully created!',
            user: {
                id: user._id,
                name: user.name,
                surname: user.surname,
                faculty: user.faculty,
                group: user.group,
                email: user.email,
                roles: authorities,
                accessToken: token
            }
        });
    });
};

exports.signup = (req, res) => {

    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        faculty: req.body.faculty,
        group: req.body.group,
        authorities: [],
        roles: [],
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
                registerUser(user, res);
            }
        );
    } else {
        Role.findOne({ name: 'student' }, (err, role) => {
            if (err) {
                console.error(err);
                res.status(500).send({ message: err });
                return;
            }
            user.roles = [role._id];
            user.authorities = [role.name];
            registerUser(user, res);
        });
    }
};

exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .populate('roles')
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ message: 'Невірний email або пароль!' });
            }

            const isPasswordValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!isPasswordValid) {
                return res.status(401).send({ message: 'Невірний email або пароль!' });
            }

            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            const authorities = user.roles.map(role => `ROLE_${ role.name.toUpperCase() }`);

            res.status(200).send({
                message: 'User was successful logged in!',
                user: {
                    id: user._id,
                    name: user.name,
                    surname: user.surname,
                    faculty: user.faculty,
                    group: user.group,
                    email: user.email,
                    roles: authorities,
                    accessToken: token
                }
            });
        });
};