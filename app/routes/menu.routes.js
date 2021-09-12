const controller = require("../controllers/menu.controller");

module.exports = function (app) {
  app.get("/menu/parent-child", controller.getListParentChild);
  app.get("/menu/:id", controller.getOne);
  app.post("/menu", controller.create);
  app.put("/menu/:id", controller.updateRecord);
  app.put("/menu/updateStatusList/:id", controller.updateStatusList);
  app.delete("/menu/:id", controller.deleteRecord);
};
