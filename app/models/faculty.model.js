const mongoose = require('mongoose');

const Faculty = mongoose.model(
    'Faculty',
    new mongoose.Schema({
        fullName: String,
        abbreviation: String,
        groups: [Object]
    })
);

module.exports = Faculty;