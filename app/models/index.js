const config = require("../config/db.config.js");

const Sequelize = require("sequelize-hierarchy")();
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.userGroup = require("../models/userGroup.model.js")(sequelize, Sequelize);
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.menu = require("../models/menu.model.js")(sequelize, Sequelize);
db.config = require("../models/config.model.js")(sequelize, Sequelize);
db.userGroupRole = require("../models/userGroupRole.model.js")(
  sequelize,
  Sequelize
);

//
db.userGroup.hasMany(db.user);
db.user.belongsTo(db.userGroup);
//
db.userGroup.belongsToMany(db.menu, { through: "userGroupRoles" });
db.menu.belongsToMany(db.userGroup, { through: "userGroupRoles" });
module.exports = db;
