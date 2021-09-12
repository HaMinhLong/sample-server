const controller = require("../controllers/userGroup.controller");

module.exports = function (app) {
  app.get("/userGroup", controller.getList);
  app.get("/userGroup/:id", controller.getOne);
  app.post("/userGroup", controller.create);
  app.put("/userGroup/:id", controller.updateRecord);
  app.put("/userGroup/updateStatus/:id", controller.updateStatus);
  app.delete("/userGroup/:id", controller.deleteRecord);
};
