const mongoose = require('mongoose');

const Advertisement = mongoose.model(
    'Advertisement',
    new mongoose.Schema({
        title: String,
        description: String,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group'
        }
    }, { timestamps: true })
);

module.exports = Advertisement;