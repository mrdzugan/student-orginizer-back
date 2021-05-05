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
    }, { timestamps: true })
);

module.exports = Advertisement;