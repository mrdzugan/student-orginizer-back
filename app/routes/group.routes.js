const { authJwt, groupMiddleware } = require('../middlewares');
const controller = require('../controllers/group.controller');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    app.post('/api/group/create', [authJwt.verifyToken, groupMiddleware.checkDuplicateGroup], controller.createGroup);

    app.get('/api/group/:id', [authJwt.verifyToken], controller.getGroup);
};