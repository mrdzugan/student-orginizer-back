const mongoose = require('mongoose');

const Timetable = mongoose.model(
    'Timetable',
    new mongoose.Schema({
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group'
        },
        schedule: {
            numerator: [
                {
                    dayOfWeek: Number,
                    lessons: [{
                        subject: String,
                        teacher: String
                    }]
                }
            ],
            denominator: [
                {
                    dayOfWeek: Number,
                    lessons: [{
                        subject: String,
                        teacher: String
                    }]
                }
            ]
        }
    })
);

module.exports = Timetable;