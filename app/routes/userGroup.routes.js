const controller = require("../controllers/userGroup.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/userGroup", controller.getList);
  app.get("/userGroup/:id", controller.getOne);
  app.post("/userGroup", controller.create);
  app.put("/userGroup/:id", controller.updateRecord);
  app.put("/userGroup/updateStatus/:id", controller.updateStatus);
  app.delete("/userGroup/:id", controller.deleteRecord);
};
