const { authJwt } = require("../middlewares");
const controller = require('../controllers/faculty.controller');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    app.get('/api/faculties', controller.getFaculties);

    app.get("/api/faculties/:id", [authJwt.verifyToken], controller.getFaculty);
};