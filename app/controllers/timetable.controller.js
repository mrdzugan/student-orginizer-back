const db = require('../models');
const Timetable = db.timetable;
const User = db.user;

exports.createTimetable = (req, res) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            console.error(err);
            res.status(500).send({ message: err });
            return;
        }

        const timetable = new Timetable({
            group: user.group,
            schedule: req.body.schedule
        });

        timetable.save((err, createdTimetable) => {
            if (err) {
                console.error(err);
                res.status(500).send({ message: err });
                return;
            }
            res.status(201).send(createdTimetable);
        });
    });
};

exports.getTimetable = (req, res) => {
    Timetable.findOne({ group: req.params.id })
        .exec((err, timetable) => {
            if (!timetable) {
                return res.status(404).send({ data: { message: 'Timetable is not found' } });
            }
            res.status(200).send({ timetable });
        });
};