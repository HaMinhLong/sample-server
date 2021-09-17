const { authJwt } = require("../middleware");
const controller = require("../controllers/userGroupRole.controller");

module.exports = function (app) {
  app.get("/userGroupRole/auth_role/:userGroupId", controller.getListRole);
  app.get(
    "/userGroupRole/auth_routes",
    [authJwt.verifyToken],
    controller.getListAuthRoutes
  );
  app.get("/userGroupRole/:id", controller.getOne);
  app.post("/userGroupRole/bulk/update/:userGroupId", controller.bulkUpdate);
};
