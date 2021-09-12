const { authJwt, verifySignUp } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.get("/user", controller.getList);
  app.get("/user/:id", controller.getOne);
  app.post(
    "/user",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    controller.create
  );
  app.put("/user/:id", controller.updateRecord);
  app.put("/user/updateStatus/:id", controller.updateStatus);
  app.delete("/user/:id", controller.deleteRecord);
  app.post("/user/currentUser", [authJwt.verifyToken], controller.currentUser);
  app.post(
    "/user/changePasswordLogin",
    [authJwt.verifyToken],
    controller.changePasswordLogin
  );
  app.post("/user/changePasswordNotLogin", controller.changePasswordNotLogin);
};
