const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/user", controller.getList);
  app.get("/user/:id", controller.getOne);
  app.post("/user", controller.create);
  app.put("/user/:id", controller.updateRecord);
  app.put("/user/updateStatus/:id", controller.updateStatus);
  app.delete("/user/:id", controller.deleteRecord);
};
