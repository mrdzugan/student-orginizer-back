const db = require('../models');
const User = db.user;
const Advertisement = db.advertisement;

exports.getAdvertisements = (req, res) => {
    Advertisement.find({})
        .populate('user')
        .exec((err, advertisements) => {
                if (err) {
                    console.error(err);
                    res.status(500).send({ message: err });
                    return;
                }
                res.status(200).send(advertisements);
            }
        );
};

exports.createAdvertisement = (req, res) => {
    User.findById(req.userId).exec((err) => {
        if (err) {
            console.error(err);
            res.status(500).send({ message: err });
            return;
        }

        const advertisement = new Advertisement({
            title: req.body.title,
            description: req.body.description,
            user: req.userId
        });

        advertisement.save((err, createdAdvertisement) => {
            if (err) {
                console.error(err);
                res.status(500).send({ message: err });
                return;
            }
            res.status(201).send(createdAdvertisement);
        });
    });
};

exports.updateAdvertisement = (req, res) => {
    Advertisement.findOne({ _id: req.params.id })
        .exec((err, advertisement) => {
            if (!advertisement) {
                return res.status(404).send({ data: { message: 'Advertisement is not found' } });
            }
            const { title, description } = req.body;
            advertisement.title = title;
            advertisement.description = description;
            advertisement.save((err, updatedAdvertisement) => {
                if (err) {
                    return res.status(400).send({ data: { message: err } });
                }
                res.status(200).send({ advertisement: updatedAdvertisement });
            });
        });
};