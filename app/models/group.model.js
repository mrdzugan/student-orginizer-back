const mongoose = require('mongoose');

const Group = mongoose.model(
    'Group',
    new mongoose.Schema({
        name: String,
        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Faculty'
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    })
);

module.exports = Group;