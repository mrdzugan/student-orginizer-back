const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/user/:id", [authJwt.verifyToken], controller.getUser);

    /*app.get("/api/test/all", controller.allAccess);

    app.get("/api/test/user", [authJwt.verifyToken], controller.studentBoard);

    app.get(
        "/api/test/mod",
        [authJwt.verifyToken, authJwt.isHeadman],
        controller.headmanBoard
    );

    app.get(
        "/api/test/admin",
        [authJwt.verifyToken, authJwt.isCurator],
        controller.curatorBoard
    );*/
};