const controller = require("../controllers/menu.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/menu/parent-child", controller.getListParentChild);
  app.get("/menu/:id", controller.getOne);
  app.post("/menu", controller.create);
  app.put("/menu/:id", controller.updateRecord);
  app.put("/menu/updateStatusList/:id", controller.updateStatusList);
  app.delete("/menu/:id", controller.deleteRecord);
};
