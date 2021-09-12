const { authJwt } = require("../middleware");
const controller = require("../controllers/userGroupRole.controller");

module.exports = function (app) {
  app.get(
    "/userGroupRole/auth_role",
    [authJwt.verifyToken],
    controller.getListRole
  );
  app.get(
    "/userGroupRole/auth_routes",
    [authJwt.verifyToken],
    controller.getListAuthRoutes
  );
  app.get("/userGroupRole/:id", [authJwt.verifyToken], controller.getOne);
  app.post(
    "/userGroupRole/bulk/update",
    [authJwt.verifyToken],
    controller.bulkUpdate
  );
};
