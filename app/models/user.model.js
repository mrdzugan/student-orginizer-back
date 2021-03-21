const mongoose = require('mongoose');

const User = mongoose.model(
    'User',
    new mongoose.Schema({
        name: String,
        surname: String,
        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Faculty'
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group'
        },
        email: String,
        password: String,
        roles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }]
    })
);

module.exports = User;