const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.post(
    "/auth/signUp",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    controller.signUp
  );
  app.post("/auth/signIn", controller.signIn);
};
