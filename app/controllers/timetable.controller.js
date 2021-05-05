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

exports.updateTimetable = (req, res) => {
    Timetable.findOne({ _id: req.params.id })
        .exec((err, timetable) => {
            if (!timetable) {
                return res.status(404).send({ data: { message: 'Timetable is not found' } });
            }
            console.log(timetable);
            const newSchedule = req.body;
            const weekType = req.body.weekType;
            const dayIndex = timetable.schedule[weekType].findIndex(day => day.dayOfWeek === newSchedule.dayOfWeek);
            delete newSchedule.weekType;
            timetable.schedule[weekType][dayIndex] = newSchedule;
            timetable.save((err, updatedTimetable) => {
                if (err) {
                    return res.status(400).send({ data: { message: err } });
                }
                res.status(200).send({ timetable: updatedTimetable });
            });
        });
};