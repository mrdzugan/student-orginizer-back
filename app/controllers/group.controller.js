const db = require('../models');
const Group = db.group;
const User = db.user;
const Faculty = db.faculty;

const addGroupToFaculty = async (facultyId, groupId) => {
    const faculty = await Faculty.findOne({ _id: facultyId }).exec();
    faculty.groups.push(groupId);
    faculty.save((err) => {
        if (err) {
            console.error(err);
            res.status(500).send({ message: err });
            return;
        }
        console.log(`[FACULTY] Successfully updated!`);
    });
};

exports.createGroup = (req, res) => {
    const group = new Group({
        name: req.body.name,
        faculty: req.body.faculty,
        members: [req.body.userId]
    });

    group.save((err, group) => {
        if (err) {
            console.error(err);
            res.status(500).send({ message: err });
            return;
        }

        addGroupToFaculty(req.body.faculty, group._id);

        User.findOneAndUpdate({ _id: req.body.userId }, { group: group._id }, { new: true }, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send({ message: err });
                return;
            }
            delete group._id;
            return res.status(201).send({
                message: 'Group successfully created!',
                group
            });
        });
    });
};

exports.getGroup = (req, res) => {
    Group.findOne({ _id: req.params.id })
        .populate({
            path: 'members',
            populate: {
                path: 'roles',
                model: 'Role'
            }
        })
        .exec((err, group) => {
            res.status(200).send({
                group
            });
        });
};