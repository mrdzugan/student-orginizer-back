const mongoose = require('mongoose');

const Faculty = mongoose.model(
    'Faculty',
    new mongoose.Schema({
        name: String,
        groups: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Group'
            }
        ]
    })
);

module.exports = Faculty;