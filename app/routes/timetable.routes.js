const { authJwt } = require("../middlewares");
const controller = require('../controllers/timetable.controller');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    //app.get('/api/timetables', controller.getTimetables);

    app.get("/api/timetable/:id", [authJwt.verifyToken], controller.getTimetable);

    app.put("/api/timetable/:id", [authJwt.verifyToken], controller.updateTimetable);

    app.post("/api/timetable/create", [authJwt.verifyToken], controller.createTimetable);
};