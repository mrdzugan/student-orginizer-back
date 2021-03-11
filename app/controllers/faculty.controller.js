const db = require('../models');
const Faculty = db.faculty;

exports.getFaculties = (req, res) => {
    Faculty.find(
        {},
        (err, faculties) => {
            if (err) {
                console.error(err);
                res.status(500).send({ message: err });
                return;
            }
            res.status(200).send(faculties);
        }
    );
};