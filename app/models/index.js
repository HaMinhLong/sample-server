const config = require("../config/db.config.js");
var bcrypt = require("bcryptjs");

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

db.config = require("../models/config.model.js")(sequelize, Sequelize);
db.userGroup = require("../models/userGroup.model.js")(sequelize, Sequelize);
db.menu = require("../models/menu.model.js")(sequelize, Sequelize);
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.userGroupRole = require("../models/userGroupRole.model.js")(
  sequelize,
  Sequelize
);

const initialData = () => {
  db.userGroup.create({
    id: 12345678910,
    userGroupName: "Quản trị hệ thống",
    userGroupDescriptions: "",
    status: 1,
  });
  db.user.create({
    id: 12345678911,
    username: "admin",
    fullName: "Hà Minh Long",
    password: bcrypt.hashSync("admin", 8),
    email: "haminhlong3@gmail.com",
    mobile: "0963339657",
    userGroupId: 12345678910,
    status: 1,
  });
  db.menu.bulkCreate([
    {
      id: 12345678910,
      menuName: "Hệ thống",
      orderBy: 1,
      url: "/",
      icon: "",
      parentId: null,
      status: 1,
    },
    {
      id: 12345678945,
      menuName: "Cấu hình hệ thống",
      orderBy: 1,
      url: "/config",
      icon: "",
      parentId: 12345678910,
      status: 1,
    },
    {
      id: 12345678911,
      menuName: "Thanh công cụ",
      orderBy: 2,
      url: "/menu",
      icon: "",
      parentId: 12345678910,
      status: 1,
    },
    {
      id: 12345678912,
      menuName: "Tài khoản - Phân quyền",
      orderBy: 2,
      url: "/",
      icon: "",
      parentId: null,
      status: 1,
    },
    {
      id: 12345678913,
      menuName: "Nhóm tài khoản",
      orderBy: 1,
      url: "/user-group",
      icon: "",
      parentId: 12345678912,
      status: 1,
    },
    {
      id: 12345678920,
      menuName: "Tài khoản",
      orderBy: 2,
      url: "/user",
      icon: "",
      parentId: 12345678912,
      status: 1,
    },
  ]);
  db.userGroupRole.bulkCreate([
    {
      id: 12345678916,
      menuName: "Hệ thống",
      menuParentId: null,
      userGroupId: 12345678910,
      menuId: 12345678910,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
    },
    {
      id: 12345678925,
      menuName: "Cấu hình hệ thống",
      menuParentId: 12345678910,
      userGroupId: 12345678910,
      menuId: 12345678945,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
    },
    {
      id: 12345678917,
      menuName: "Thanh công cụ",
      menuParentId: 12345678910,
      userGroupId: 12345678910,
      menuId: 12345678911,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
    },
    {
      id: 12345678918,
      menuName: "Tài khoản - Phân quyền",
      menuParentId: null,
      userGroupId: 12345678910,
      menuId: 12345678912,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
    },
    {
      id: 12345678919,
      menuName: "Nhóm tài khoản",
      menuParentId: 12345678912,
      userGroupId: 12345678910,
      menuId: 12345678913,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
    },
    {
      id: 12345678930,
      menuName: "Tài khoản",
      menuParentId: 12345678912,
      userGroupId: 12345678910,
      menuId: 12345678920,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
    },
  ]);
};

// initialData();

//
db.userGroup.hasMany(db.user);
db.user.belongsTo(db.userGroup);
//
db.userGroup.belongsToMany(db.menu, { through: "userGroupRoles" });
db.menu.belongsToMany(db.userGroup, { through: "userGroupRoles" });

module.exports = db;
