const { authJwt } = require('../middlewares');
const controller = require('../controllers/advertisement.controller');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    app.post('/api/advertisements/create', [authJwt.verifyToken], controller.createAdvertisement);

    app.get('/api/advertisements', [authJwt.verifyToken], controller.getAdvertisements);

    app.put('/api/advertisements/:id', [authJwt.verifyToken], controller.updateAdvertisement);
};