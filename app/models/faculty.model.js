const mongoose = require('mongoose');

const Faculty = mongoose.model(
    'Faculty',
    new mongoose.Schema({
        fullName: String,
        abbreviation: String,
        groups: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group'
        }]
    })
);

module.exports = Faculty;