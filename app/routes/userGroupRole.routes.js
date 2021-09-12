const controller = require("../controllers/userGroupRole.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/userGroupRole/auth_role", controller.getListRole);
  app.get("/userGroupRole/auth_routes", controller.getListAuthRoutes);
  app.get("/userGroupRole/:id", controller.getOne);
  app.post("/userGroupRole/bulk/update/:id", controller.bulkUpdate);
};
