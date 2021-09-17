const controller = require("../controllers/config.controller");

module.exports = function (app) {
  app.get("/config", controller.getList);
  app.post("/config", controller.create);
  app.put("/config/:id", controller.updateRecord);
  app.delete("/config/:id", controller.deleteRecord);
};
